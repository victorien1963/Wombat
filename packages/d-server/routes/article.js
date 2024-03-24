const express = require('express')
const router = express.Router()

const pg = require('../services/pgService')
// const { getChatResponse: gcr } = require('../services/chatgpt')
// const apiServices = require('../services/apiService')
// const { upload, download } = require('../services/minio')

router.get('/', async (req, res) => {
  if (!req.user) res.send({ error: 'user not found' })
  const { user_id } = req.user
  const articles = await pg.exec('any', 'SELECT * FROM articles', [])
  return res.send(articles)
})

router.get('/:article_id', async (req, res) => {
  if (!req.user) res.send({ error: 'user not found' })
  const { user_id } = req.user
  const articles = await pg.exec('oneOrNone', 'SELECT * FROM articles WHERE article_id = $1', [req.params.article_id])
  return res.send(articles)
})

router.post('/', async (req, res) => {
    if (!req.user) res.send({ error: 'user not found' })
    const { user_id } = req.user
    const article = await pg.exec('one', 'INSERT INTO articles(user_id, setting, created_on, updated_on) values($1, $2, current_timestamp, current_timestamp) RETURNING *', [user_id, {
        topic: '',
        Pkeywords: [
          {
            label: 'keyword1',
          },
          {
            label: 'keyword2',
          },
          {
            label: 'keyword3',
          },
        ],
        Skeywords: [
          {
            label: 'keyword1',
          },
          {
            label: 'keyword2',
          },
          {
            label: 'keyword3',
          },
        ],
        titles: [
          {
            label: 'title1',
          },
          {
            label: 'title2',
          },
          {
            label: 'title3',
          },
        ],
        Pkeyword: [],
        Skeyword: [],
        title: '',
        setting: {},
        headings: [
          [
            'Introduction 1',
            'First Section',
            'Second Section',
            'Final Section',
            'Ending',
          ],
          [
            'Introduction 2',
            'First Section',
            'Second Section',
            'Final Section',
            'Ending',
          ],
          [
            'Introduction 3',
            'First Section',
            'Second Section',
            'Final Section',
            'Ending',
          ],
        ],
        heading: [
          'Introduction',
          'First Section',
          'Second Section',
          'Final Section',
          'Ending',
        ],
        Article: {
          thumbnail: '',
          content: [],
          status: 'pending',
        },
      }])
    return res.send(article)
})

router.put('/:article_id', async (req, res) => {
    if (!req.user) res.send({ error: 'user not found' })
    const { user_id } = req.user
    const { datas, action } = req.body
    const article = await pg.exec('SELECT * FROM articles WHERE article_id = $1', [req.params.article_id])
    let { setting } = article
    switch(action) {
        case 'pk':
            setting = {
                ...article.setting,
                Pkeywords: [
                    {
                      label: 'keyword1',
                    },
                    {
                      label: 'keyword2',
                    },
                    {
                      label: 'keyword3',
                    },
                ],
            }
            break
        case 'headings':
            setting = {
                ...article.setting,
                titles: [
                    {
                      label: 'title1',
                    },
                    {
                      label: 'title2',
                    },
                    {
                      label: 'title3',
                    },
                  ],
            }
            break
        case 'sk':
            setting = {
                ...article.setting,
                Skeywords: [
                    {
                      label: 'keyword1',
                    },
                    {
                      label: 'keyword2',
                    },
                    {
                      label: 'keyword3',
                    },
                  ],
            }
            break
        case 'headings':
            setting = {
                ...article.setting,
                headings: [
                    [
                      'Introduction 1',
                      'First Section',
                      'Second Section',
                      'Final Section',
                      'Ending',
                    ],
                    [
                      'Introduction 2',
                      'First Section',
                      'Second Section',
                      'Final Section',
                      'Ending',
                    ],
                    [
                      'Introduction 3',
                      'First Section',
                      'Second Section',
                      'Final Section',
                      'Ending',
                    ],
                  ],
            }
            break
        case 'article':
            setting = {
                ...article.setting,
                Article: {
                    thumbnail: '',
                    content: [{
                        Section: 'Introduction',
                        Text: 'This is Introduction'
                    },{
                        Section: 'First Section',
                        Text: 'This is First Section'
                    },{
                        Section: 'Second Section',
                        Text: 'This is Second Section'
                    },{
                        Section: 'Final Section',
                        Text: 'This is Final Section'
                    },{
                        Section: 'Ending',
                        Text: 'This is Ending'
                    }],
                    status: 'done',
                  },
            }
            break
        default:
            break
    }
    article = await pg.exec('UPDATE articles SET setting = $1 WHERE article_id = $2', [setting, req.params.article_id])
    // gcr([], () => {}, async (chat) => {
    //     const updated = await pg.exec('one', 'INSERT INTO chats(user_id, setting, created_on) VALUES($1, $2, current_timestamp) RETURNING *', [id, { chat, from: 'gpt'  }])
    //     io.to(id).emit('chat', newChat)
    // }, 1000, 1, models[id])
    return res.send(article)
})

router.delete('/:article_id', async (req, res) => {
  if (!req.user) return res.send({ error: 'user not found' })
  const deleted = await pg.exec('oneOrNone', 'DELETE FROM articles WHERE article_id = $1', [req.params.article_id])
  return res.send(deleted)
})

module.exports = router