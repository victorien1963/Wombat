const express = require('express')
const router = express.Router()

const pg = require('../services/pgService')
const apiServices = require('../services/apiService')
const { upload, download } = require('../services/minio')

router.post('/', async (req, res) => {
    if (!req.user) res.send({ error: 'user not found' })
    const { user_id } = req.user
    const draft = await pg.exec('one', 'INSERT INTO drafts(user_id, setting, created_on, updated_on) values($1, $2, current_timestamp, current_timestamp) RETURNING *', [user_id, {
        module1: {},
        module2: {},
        module3: {},
        module4: {},
        ...req.body,
        // id: `DP${Date.now().toString().substring(6, 12)}`
    }])
    return res.send(draft)
})

router.delete('/:draft_id', async (req, res) => {
    if (!req.user) res.send({ error: 'user not found' })
    const deleted = await pg.exec('oneOrNone', 'DELETE FROM drafts WHERE draft_id = $1 RETURNING *', [`${req.params.draft_id}`])
    console.log(`Event: Draft Delete Time:${Date.now()} User:${req.user.name} Content: Draft ${req.params.draft_id} has been deleted by user:${req.user.name}`)
    return res.send(deleted)
})

router.get('/image/:name', async (req, res) => {
    try {
        const { name } = req.params
        if (name.startsWith('imagejob:')) {
            const [image_job_id, num] = name.split(':')[1].split('_')
            const job = await pg.exec('oneOrNone', 'SELECT * FROM image_jobs WHERE image_job_id = $1', [image_job_id])
            const { status, setting } = job
            if (status === 'COMPLETED') {
                const file = await download({ Key: setting.imgs[num].name })
                if (!file.error) file.pipe(res)
                else return res.send(file)
            } else {
                return res.send('PENDING')
            }
        } else {
            const file = await download({ Key: req.params.name })
            if (!file.error) file.pipe(res)
            else return res.send(file)
        }
    } catch (e) {
        return res.send('')
    }
})

router.post('/image', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const uploads = await Promise.all(JSON.parse(req.body.files).map((file) => {
        return upload({ Key: file.name, Body: Buffer.from(file.data) })
    }))
    return res.send(uploads)
})

module.exports = router