const express = require('express')
const router = express.Router()

const pg = require('../services/pgService')
const { getChatResponse: gcr } = require('../services/chatgpt')
// const apiServices = require('../services/apiService')
// const { upload, download } = require('../services/minio')

router.get('/', async (req, res) => {
  if (!req.user) return res.send({ error: 'user not found' })
  const { user_id } = req.user
  const articles = await pg.exec('any', 'SELECT *,(SELECT name AS user_name FROM users u WHERE u.user_id = a.user_id) FROM articles a', [])
  return res.send(articles)
})

router.get('/:article_id', async (req, res) => {
  if (!req.user) return res.send({ error: 'user not found' })
  const { user_id } = req.user
  const articles = await pg.exec('oneOrNone', 'SELECT * FROM articles WHERE article_id = $1', [req.params.article_id])
  return res.send(articles)
})

router.post('/:project_id', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
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
          Text: '',
          status: 'pending',
        },
        project_id: req.params.project_id,
        ...req.body,
      }])
    return res.send(article)
})

router.put('/:article_id', async (req, res) => {
    if (!req.user) return res.send({ error: 'user not found' })
    const { user_id } = req.user
    const { datas, step } = req.body
    const article = await pg.exec('SELECT * FROM articles WHERE article_id = $1', [req.params.article_id])
    let { setting } = article

    const gptFuncs = [
      () => {
        gcr([
          { role: 'user', content: `你是一個劇本作家，請以${datas.topic}為主題，列出5個最符合該主題的Prime Keyword，以「1.」「2.」「3.」「4.」「5.」作為項目符號` }
        ], () => {}, async (chat) => {
          console.log(chat)
          const keywords = [
            chat.substring(chat.indexOf('1.') + 2, chat.indexOf('2.')),
            chat.substring(chat.indexOf('2.') + 2, chat.indexOf('3.')),
            chat.substring(chat.indexOf('3.') + 2, chat.indexOf('4.')),
            chat.substring(chat.indexOf('4.') + 2, chat.indexOf('5.')),
            chat.substring(chat.indexOf('5.') + 2),
          ]
          console.log(keywords)
          const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
            ...setting,
            ...datas,
            Pkeywords: keywords.map((k) => ({ label: k.replaceAll('.', '').trim() })),
            step,
          }, req.params.article_id])
          console.log(updated)
          return res.send(updated)
        }, 500, 1)
      },
      () => {
        gcr([
          { role: 'user', content: `你是一個劇本作家，請以${datas.topic}為主題，以${datas.Pkeyword[0]}為Prime Keyword，列出五個合適的標題，以「1.」「2.」「3.」「4.」「5.」作為項目符號` }
        ], () => {}, async (chat) => {
          console.log(chat)
          const titles = [
            chat.substring(chat.indexOf('1.') + 2, chat.indexOf('2.')),
            chat.substring(chat.indexOf('2.') + 2, chat.indexOf('3.')),
            chat.substring(chat.indexOf('3.') + 2, chat.indexOf('4.')),
            chat.substring(chat.indexOf('4.') + 2, chat.indexOf('5.')),
            chat.substring(chat.indexOf('5.') + 2),
          ]
          console.log(titles)
          const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
            ...setting,
            ...datas,
            titles: titles.map((k) => ({ label: k.replaceAll('.', '').trim() })),
            step,
          }, req.params.article_id])
          console.log(updated)
          return res.send(updated)
        }, 500, 1)
      },
      () => {
        gcr([
          { role: 'user', content: `你是一個劇本作家，請以${datas.topic}為主題，以${datas.Pkeyword[0]}為Prime Keyword，以${datas.title}為標題的劇本，列出15個合適的的Secondary Keyword，以「1.」「2.」「3.」「4.」「5.」作為項目符號` }
        ], () => {}, async (chat) => {
          console.log(chat)
          const keywords = [
            chat.substring(chat.indexOf('1.') + 2, chat.indexOf('2.')),
            chat.substring(chat.indexOf('2.') + 2, chat.indexOf('3.')),
            chat.substring(chat.indexOf('3.') + 2, chat.indexOf('4.')),
            chat.substring(chat.indexOf('4.') + 2, chat.indexOf('5.')),
            chat.substring(chat.indexOf('5.') + 2, chat.indexOf('6.')),
            chat.substring(chat.indexOf('6.') + 2, chat.indexOf('7.')),
            chat.substring(chat.indexOf('7.') + 2, chat.indexOf('8.')),
            chat.substring(chat.indexOf('8.') + 2, chat.indexOf('9.')),
            chat.substring(chat.indexOf('9.') + 2, chat.indexOf('10.')),
            chat.substring(chat.indexOf('10.') + 2, chat.indexOf('11.')),
            chat.substring(chat.indexOf('11.') + 2, chat.indexOf('12.')),
            chat.substring(chat.indexOf('12.') + 2, chat.indexOf('13.')),
            chat.substring(chat.indexOf('13.') + 2, chat.indexOf('14.')),
            chat.substring(chat.indexOf('14.') + 2, chat.indexOf('15.')),
            chat.substring(chat.indexOf('15.') + 2),
          ]
          console.log(keywords)
          const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
            ...setting,
            ...datas,
            Skeywords: keywords.map((k) => ({ label: k.replaceAll('.', '').trim() })),
            step,
          }, req.params.article_id])
          console.log(updated)
          return res.send(updated)
        }, 500, 1)
      },
      () => {
        gcr([
          { role: 'user', content: `你是一個劇本作家，請以${datas.topic}為主題，以${datas.Pkeyword[0]}為Prime Keyword，以${datas.title}為標題的劇本，這份劇本可能會包含以下的Secondary Keyword：${datas.Skeyword.join(',')}。請依以上前提寫出簡單的段落標題，例如
          1. Introduction 2,
          2. First Section,
          3. Second Section,
          4. Final Section,
          5. Ending，以「1.」「2.」「3.」「4.」「5.」作為項目符號` }
        ], () => {}, async (chat) => {
          console.log(chat)
          const heading = [
            chat.substring(chat.indexOf('1.') + 2, chat.indexOf('2.')),
            chat.substring(chat.indexOf('2.') + 2, chat.indexOf('3.')),
            chat.substring(chat.indexOf('3.') + 2, chat.indexOf('4.')),
            chat.substring(chat.indexOf('4.') + 2, chat.indexOf('5.')),
            chat.substring(chat.indexOf('5.') + 2),
          ]
          console.log(heading)
          const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
            ...setting,
            ...datas,
            heading,
            step,
            // headings: keywords.map((k) => ({ label: k.replaceAll('.', '').trim() }))
          }, req.params.article_id])
          console.log(updated)
          return res.send(updated)
        }, 500, 1)
      },
      async () => {
        const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
          ...setting,
          ...datas,
          prompt: `你是一個劇本作家，請依以下的架構：${datas.heading.join(',')}撰寫以${datas.topic}為主題，以${datas.Pkeyword[0]}為Prime Keyword，以${datas.title}為標題的劇本，這份劇本可能會包含以下的Secondary Keyword：${datas.Skeyword.join(',')}，每個段落不小於150字，不多於300字。`,
          step,
          // headings: keywords.map((k) => ({ label: k.replaceAll('.', '').trim() }))
        }, req.params.article_id])
        return res.send(updated)
      },
      async () => {
        gcr([
          { role: 'user', content: datas.prompt || `你是一個劇本作家，請依以下的架構：${datas.heading.join(',')}撰寫以${datas.topic}為主題，以${datas.Pkeyword[0]}為Prime Keyword，以${datas.title}為標題的劇本，這份劇本可能會包含以下的Secondary Keyword：${datas.Skeyword.join(',')}，每個段落不小於150字，不多於300字。` }
        ], () => {}, async (chat) => {
          console.log(chat)
          const updated = await pg.exec('oneOrNone', 'UPDATE articles SET setting = $1 WHERE article_id = $2 RETURNING *', [{
            ...setting,
            ...datas,
            Article: {
              thumbnail: '',
              Text: chat,
            },
            step,
            // headings: keywords.map((k) => ({ label: k.replaceAll('.', '').trim() }))
          }, req.params.article_id])
          console.log(updated)
          return res.send(updated)
        }, 2000, 1)
      },
    ]

    if (!gptFuncs[step.now]) return res.send(article)
    gptFuncs[step.now]()
    // switch (step.now) {
    //   case 1:
    //     break
    //     case 1:
    //       break
    //       case 1:
    //         break
    //         case 1:
    //           break
    //           case 1:
    //             break
    //             case 1:
    //               break
    //               case 1:
    //                 break
    //                 case 1:
    //                   break
    //                   case 1:
    //                     break
    // }


    // switch(action) {
    //     case 'pk':
    //         setting = {
    //             ...article.setting,
    //             Pkeywords: [
    //                 {
    //                   label: 'keyword1',
    //                 },
    //                 {
    //                   label: 'keyword2',
    //                 },
    //                 {
    //                   label: 'keyword3',
    //                 },
    //             ],
    //         }
    //         break
    //     case 'headings':
    //         setting = {
    //             ...article.setting,
    //             titles: [
    //                 {
    //                   label: 'title1',
    //                 },
    //                 {
    //                   label: 'title2',
    //                 },
    //                 {
    //                   label: 'title3',
    //                 },
    //               ],
    //         }
    //         break
    //     case 'sk':
    //         setting = {
    //             ...article.setting,
    //             Skeywords: [
    //                 {
    //                   label: 'keyword1',
    //                 },
    //                 {
    //                   label: 'keyword2',
    //                 },
    //                 {
    //                   label: 'keyword3',
    //                 },
    //               ],
    //         }
    //         break
    //     case 'headings':
    //         setting = {
    //             ...article.setting,
    //             headings: [
    //                 [
    //                   'Introduction 1',
    //                   'First Section',
    //                   'Second Section',
    //                   'Final Section',
    //                   'Ending',
    //                 ],
    //                 [
    //                   'Introduction 2',
    //                   'First Section',
    //                   'Second Section',
    //                   'Final Section',
    //                   'Ending',
    //                 ],
    //                 [
    //                   'Introduction 3',
    //                   'First Section',
    //                   'Second Section',
    //                   'Final Section',
    //                   'Ending',
    //                 ],
    //               ],
    //         }
    //         break
    //     case 'article':
    //         setting = {
    //             ...article.setting,
    //             Article: {
    //                 thumbnail: '',
    //                 content: [{
    //                     Section: 'Introduction',
    //                     Text: 'This is Introduction'
    //                 },{
    //                     Section: 'First Section',
    //                     Text: 'This is First Section'
    //                 },{
    //                     Section: 'Second Section',
    //                     Text: 'This is Second Section'
    //                 },{
    //                     Section: 'Final Section',
    //                     Text: 'This is Final Section'
    //                 },{
    //                     Section: 'Ending',
    //                     Text: 'This is Ending'
    //                 }],
    //                 status: 'done',
    //               },
    //         }
    //         break
    //     default:
    //         break
    // }
    // article = await pg.exec('UPDATE articles SET setting = $1 WHERE article_id = $2', [setting, req.params.article_id])
    // return res.send(article)
})

router.delete('/:article_id', async (req, res) => {
  if (!req.user) return res.send({ error: 'user not found' })
  const deleted = await pg.exec('oneOrNone', 'DELETE FROM articles WHERE article_id = $1', [req.params.article_id])
  return res.send(deleted)
})

module.exports = router