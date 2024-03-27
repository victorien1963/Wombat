const express = require('express')
const router = express.Router()

const pg = require('../services/pgService')

router.get('/', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    const projects = await pg.exec('any', 'SELECT * FROM projects WHERE user_id = $1', [user_id])
    return res.send(projects)
})

router.post('/', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    const project = await pg.exec('one', 'INSERT INTO projects(user_id, setting, created_on, updated_on) values($1, $2, current_timestamp, current_timestamp) RETURNING *', [user_id, {
        ...req.body,
    }])
    return res.send(project)
})

router.get('/:project_id', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    const project = await pg.exec('oneOrNone', 'SELECT * FROM projects WHERE project_id = $1', [req.params.project_id])
    return res.send(project)
})

router.put('/:project_id', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    const { setting } = req.body
    const updated = await pg.exec('oneOrNone', 'UPDATE projects SET setting = $1 WHERE project_id = $2 RETURNING *', [setting, req.params.project_id])
    console.log(updated)
    return res.send(updated)
})

router.delete('/:project_id', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    await pg.exec('oneOrNone', 'DELETE FROM projects WHERE project_id = $1', [req.params.project_id])
    return res.send('')
})

module.exports = router