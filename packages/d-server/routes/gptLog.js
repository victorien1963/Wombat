const express = require('express')
const router = express.Router()

const pg = require('../services/pgService')

router.get('/', async (req, res) => {
    if (!req.user) res.send({ error: 'user not found' })
    const { user_id } = req.user
    const data = await pg.exec('any', 'SELECT * FROM gpt_logs WHERE user_id = $1', [user_id])
    console.log(data)
    return res.send(data)
})

module.exports = router