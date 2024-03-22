const express = require('express')
// passport.js
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// postgres
const pg = require('../services/pgService')

const router = express.Router()

const hash = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds) 
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

const signin = (req, res) => {
    console.log(`Event: Login Time:${Date.now()} User:${req.user.name} Content: ${req.user.name} has logged in `)
    const token = jwt.sign({ _id: req.user.user_id, email: req.user.email }, 'APPLE')
    return res.send({ token })
}

const verify = async (password, hash) => {
    const result = await bcrypt.compare(password, hash)
    return result
}

// passport local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    const user = await pg.exec('oneOrNone', 'SELECT user_id,name,password FROM users WHERE email = $1', [email])
    console.log(`Event: Login failed, Time:${Date.now()} User: none Content: user with email ${email} not exists`)
    if (!user) return done(null, false)
    console.log(`Event: Login failed, Time:${Date.now()} User: none Content: password auth failed with email ${email}`)
    const verified = await verify(password, user.password)
    if (!verified) { return done(null, false) }
    return done(null, user)
  }
))

router.post('/login', passport.authenticate('local', { session: false }), signin)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const hashed = await hash(password)
  const user = await pg.exec('one','INSERT INTO users(name, email, password, setting, created_on) VALUES($1, $2, $3, $4, current_timestamp) RETURNING user_id,email', [name, email, hashed, { admin: true }])
  if (!user.user_id) {
    console.log(`Event: register failed, Time:${Date.now()} User: none Content: register failed, email ${email} already exists`)
    return res.send({ error: 'email exists' })
  }
  const token = jwt.sign({ _id: user.user_id, email: user.email }, 'APPLE')
  return res.send({ token })
})

module.exports = router
