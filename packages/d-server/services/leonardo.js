const pg = require('./pgService')
// const schedule = require('node-schedule')
const apiService = require('./apiService')
const { upload } = require('./minio')
const sdk = require('api')('@leonardoai/v1.0#54226lnmh2s7d')
sdk.auth(process.env.LEONARDO_KEY)

const generate = async (prompt, num_images = 1) => {
    const job = await pg.exec('one', 'INSERT INTO image_jobs(platform,status,setting,created_on,updated_on) values($1,$2,$3,current_timestamp,current_timestamp) RETURNING image_job_id', ['leonardo.ai', 'WAITING', { prompt, num_images }])
    return Array.from({ length: num_images }).map((x, i) => `/api/draft/image/imagejob:${job.image_job_id}_${i}`)
}

const getOptions = (prompt = 'An oil painting of a cat', num_images = 1) => {
    return {
        // modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
        num_images,
        prompt,
        alchemy: true,
        photoReal: true,
        photoRealStrength: 0.45,
    }
}

const getImages = async (id) => {
    const imgs = await sdk.getGenerationById({ id })
    if (imgs.data.generations_by_pk.status === 'PENDING') {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(5000)
        const refetch = await getImages(id)
        return refetch
    }
    return imgs
}

const reducer = async () => {
    console.log('START SCHEDULED IMAGE JOB')
    const jobs = await pg.exec('any', 'SELECT * FROM image_jobs WHERE platform = $1 AND status = $2', ['leonardo.ai', 'WAITING'])
    if (jobs.error) return
    console.log('FOUNTD WAITING JOBS')
    console.log(jobs)
    let max = 50
    jobs.forEach(async ({ image_job_id, setting }) => {
        const { prompt, num_images } = setting
        max = max - num_images
        console.log(`---------------------FOUNTD WAITING JOB ${image_job_id} ${prompt}-------------------------`)
        console.log(`---------------------${num_images} image remain, max is ${max}--------------------`)
        if (max < 0) return
        console.log('---------------------start generate---------------------------')
        console.log(setting)
        console.log('---------------------start generate---------------------------')
        pg.exec(
            'one',
            'UPDATE image_jobs SET status = $1 WHERE image_job_id = $2',
            [
                'PENDING',
                image_job_id
            ]
        )
        const data = getOptions(prompt, num_images)
        try {
        const res = await sdk.createGeneration(data)
        if (res.error) {
            console.log(res.error)
        }
        const imgs = await getImages(res.data.sdGenerationJob.generationId)
        console.log('-----------------generation is done, fetch imgs-----------------')
        const uploadeds = await Promise.all(imgs.data.generations_by_pk.generated_images.map(async ({ url, ...data }) => {
            console.log('-----------------url-----------------')
            console.log(url)
            const getImage = async (retry) => {
                if (retry > 10) return ''
                const img = await apiService.send({
                    url,
                    method: 'get',
                    responseType: 'arraybuffer'
                })
                if (img.error) {
                    const retryed = await getImage(retry + 1)
                    return retryed
                }
                return img
            }
            const img = await getImage(1)
            console.log('-----------------img datas-----------------')
            console.log(data)
            try {
                const uploaded = await upload({ Key: `haha`, Body: Buffer.from(img) })
                console.log('-----------------img uploded-----------------')
                console.log(uploaded)
                return uploaded
            } catch (e) {
                console.log(e)
                console.log(img)
                return { name: '' }
            }
        }))
        console.log(uploadeds)
        pg.exec(
            'one',
            'UPDATE image_jobs SET status = $1, setting = $2 WHERE image_job_id = $3',
            [
                'COMPLETED',
                {
                    ...setting,
                    imgs: uploadeds
                },
                image_job_id
            ]
        )
        } catch (e) {
            console.log(e)
        }
    })
}

// const imageJob = schedule.scheduleJob('*/1 * * * *', async () => {
//     reducer()
// })
  
module.exports = {
    generate,
    // imageJob,
}