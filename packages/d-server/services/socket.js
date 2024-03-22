const { Server } = require('socket.io')
const { getChatResponse: gcr } = require('./chatgpt')
const { initDraft, editDraft } = require('./draft')
const { generate } = require('./leonardo')
const pg = require('./pgService')

const initHelper = async (user_id, callback) => {
  let chats = await pg.exec('any', 'SELECT * FROM chats WHERE user_id = $1', [user_id])
  callback(chats)
}

const trimAll = (s) => s && s.replaceAll ? s.replaceAll(' ', '').replaceAll('*', '').replaceAll('-', '').replaceAll('#', '').replaceAll(':', '').replaceAll('：', '') : s || ''

const models = {}

const socket = {}
socket.init = (server, setting) => {
  const io = new Server(server, setting)
  io.on('connection', (socket) => {
    const id = socket.handshake.auth.auth
    socket.join(id)
    if (!models[id]) models[id] = 'gpt-3.5-turbo'
    else io.to(id).emit('model', models[id])

    const getChatResponse = (history, streamFunc, replyFunc, max_tokens, n) => gcr(history, streamFunc, replyFunc, max_tokens, n, models[id])

    // gpt helper
    initHelper(id, (chats) => io.to(id).emit('gpt', chats))
    socket.on('gpt', async (message) => {
      const newMessage = await pg.exec('one', 'INSERT INTO chats(user_id, setting, created_on) VALUES($1, $2, current_timestamp) RETURNING *', [id, { chat: message, from: id }])
      io.to(id).emit('chat', newMessage)
      const history = await pg.exec('any', 'SELECT setting FROM chats WHERE user_id = $1', [id])
      getChatResponse(
        history.slice(Math.max(0, history.length - 11), history.length).map((h) => ({ role: h.setting.from === 'gpt' ? 'assistant' : 'user', content: h.setting.chat })).concat([{ role: 'user', content: '回答請控制在200字以內' }]),
        (stream) => io.to(id).emit('stream', stream),
        async (chat) => {
          const newChat = await pg.exec('one', 'INSERT INTO chats(user_id, setting, created_on) VALUES($1, $2, current_timestamp) RETURNING *', [id, { chat, from: 'gpt'  }])
          io.to(id).emit('chat', newChat)
        }, 1000)
    })

    // draft
    socket.on('draft', async ({ action, data }) => {
      if (action === 'init') {
        const draft = await initDraft(id)
        io.to(id).emit('draft', draft)
      } else if (action === 'update') {
        editDraft(data)
      }
    })

    // model
    socket.on('model', async (message) => {
      models[id] = message
      io.to(id).emit('model', models[id])
    })

    // module 1
    socket.on('module1', async (message) => {
      const { option1, option2, draftId } = message
      console.log(`user ${id} called module1 with option1:${option1}, option2:${option2}`)
      try {
        const user = await pg.exec('one', 'SELECT setting FROM users WHERE user_id = $1', [id])
        const updated = await pg.exec('one', 'UPDATE users set setting = $2 WHERE user_id = $1 RETURNING setting', [
          id,
          { ...user.setting, records: user.setting.records
            ? [...user.setting.records, { module: '/Module1', field: 'option1', value: option1 }, { module: '/Module1', field: 'option2', value: option2 }, { module: '/Module2', field: 'option1', value: option1 }, { module: '/Module2', field: 'option2', value: option2 }]
            : [{ module: '/Module1', field: 'option1', value: option1 }, { module: '/Module1', field: 'option2', value: option2 }, { module: '/Module1', field: 'option1', value: option1 }, { module: '/Module1', field: 'option2', value: option2 }]
          }
        ])
        io.to(id).emit('me', { records: updated.setting.records })
      } catch (e) {
        if (e) console.log('fail to write search log')
      }

      const ts = Date.now()
      io.to(id).emit('module1', { generating: true, step: '生成PESTEL中', process: 0, max: 99, time: 100, topic: option1, region: option2, option1, option2, ts, draftId })

      let limit = 3
      const getTags = async () => {
        const gptLog = {}
        try {
          const tag1 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。} 
                
                #1:
                 {以PESTEL分析法，針對特定國家或區域的產業現況進行分析，分析時要考量以下幾個面向與指標： 
                1. 政治 Political 
                - 稅率未來會更動嗎？ 
                - 有哪些法規與公司的營運有直接關聯？ 
                - 目前有正在提議修改的法規嗎？如果修法通過，對公司的影響是什麼？ 
                - 外交政策的變化對公司有影響嗎？}
                
                請你參考#1，用PESTEL分析[${option2}]地區的[${option1}]，從"政治"面向進行分析，[政治下面細分：政策支持、法規環境、國際關係]，各細分面向字數分別為40-50個字。` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tag2 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。} 
                
                #1:
                {以PESTEL分析法，針對特定國家或區域的產業現況進行分析，分析時要考量以下幾個面向與指標：
                2. 經濟 Economic 
                - 目前整體的經濟狀況與消費力道如何？是在上升？還是下降？原因是為什麼？ 
                - 匯率目前的狀態？未來會有大幅改變嗎？ 
                - 失業率是上升還是下降？對公司人才的招募有影響嗎？ 
                - 未來原物料價格的走勢，會降低公司的利潤嗎？}
                
                請你參考#1，用PESTEL分析[${option2}]地區的[${option1}]，從"經濟"面向進行分析，[經濟下面細分：市場需求、產業競爭力、成本結構]，各細分面向字數分別為40-50個字。
                ` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tag3 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。} 
                
                #1:
                 {以PESTEL分析法，針對特定國家或區域的產業現況進行分析，分析時要考量以下幾個面向與指標： 
                3. 社會 Social 
                - 出生人口在下降還是上升？ 
                - 消費者關注的文化與教育的議題是什麼？ 
                - 消費者近期喜歡什麼？他們的生活習慣有改變嗎？消費頻率變多還是變少？
                - 哪些社會的因素可能會提高公司業績？}
                
                請你參考#1，用PESTEL分析[${option2}]地區的[${option1}]，從"社會"面向進行分析，[社會下面細分：綠色意識、都市化趨勢、消費者偏好]，各細分面向字數分別為40-50個字。
                ` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tag4 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。} 
                
                #1:
                 {以PESTEL分析法，針對特定國家或區域的產業現況進行分析，分析時要考量以下幾個面向與指標： 
                4. 技術 Technological 
                - 近期發表的新科技，有哪些可以拿來應用？ 
                - 有哪些數位技術，可能會推動公司成長？ 
                - 近期政府和研究單位都關注哪些科技議題？}
                
                請你參考#1，用PESTEL分析[${option2}]地區的[${option1}]，從"技術"面向進行分析，[技術下面細分：核心技術、基礎建設、週邊設備]，各細分面向字數分別為40-50個字。` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tag5 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。} 
                
                請你用PESTEL分析[${option2}]地區的[${option1}]，從"環境"面向進行分析，[環境下面細分：氣候條件、環保政策、可能再生能源]，各細分面向字數分別為40-50個字。
                ` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tag6 = getChatResponse(
            [
              { role: 'user', content: `你是一位專業的總體經濟學家。
                根據以下規範和輸入的目標來輸出最佳結果。
                內容能夠輕鬆理解。
                刪除任何無關緊要的文本，無關緊要的文本示例："嗯" 修正任何明顯的拼寫錯誤。
                以列點的方式進行描述。
                使用markdown結構化信息輸出文檔。
                使用標題、副標題、項目符號和粗體來組織文字。}
                
                請你用PESTEL分析[${option2}]地區的[${option1}]，從"法規"面向進行分析，[法規下面細分：政治因素、經濟因素、社會文化因素]，各細分面向字數分別為40-50個字。` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const tags = await Promise.all([
            tag1,
            tag2,
            tag3,
            tag4,
            tag5,
            tag6,
          ])
          const substrings = {
            政治: tags[0],
            經濟: tags[1],
            社會: tags[2],
            技術: tags[3],
            環境: tags[4],
            法律: tags[5],
          }
          console.log(substrings)
          const subkeys = {
            政治: ['政策支持','法規環境','國際關係'],
            經濟: ['市場需求','產業競爭力','成本結構'],
            社會: ['綠色意識','都市化趨勢','消費者偏好'],
            技術: ['核心技術','基礎建設','週邊設備'],
            環境: ['氣候條件','環保政策','可能再生能源'],
            法律: ['政治因素','經濟因素','社會文化因素'],
          }
          
          Object.keys(substrings).forEach((key) => {
            const subkey = subkeys[key]
            const [content1, content2, content3] = [
              substrings[key].substring(substrings[key].indexOf(subkey[0]), substrings[key].indexOf(subkey[1])).replace(subkey[0], ''),
              substrings[key].substring(substrings[key].indexOf(subkey[1]), substrings[key].indexOf(subkey[2])).replace(subkey[1], ''),
              substrings[key].substring(substrings[key].indexOf(subkey[2]), substrings[key].length).replace(subkey[2], ''),
            ]
            const content = [
              [subkey[0], trimAll(content1), '', 1],
              [subkey[1], trimAll(content2), '', 2],
              [subkey[2], trimAll(content3), '', 3],
            ]
            gptLog[key] = content
          })

          const logging = await pg.exec('one', 'INSERT INTO gpt_logs(user_id, setting, created_on, updated_on) values($1, $2, current_timestamp, current_timestamp) RETURNING *', [id, {
            setting: {
              option1,
              option2,
              ts,
              ...gptLog
            },
          }])
          console.log('-------delaying response-------')
          const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
          await delay(2000)
          console.log('-------sending response-------')
          io.to(id).emit('module1', { ...gptLog, generating: false, process: 0, max: 100, t: ts, draftId })
        } catch (e) {
          console.log(e)
          if (limit > 0) {
            limit -= 1
            console.log(`retry limit left ${limit}, retrying`)
            getTags()
          } else {
            io.to(id).emit('module1', { generating: false, t: ts, draftId })
          }
        }
      }
      getTags()
    })
    // module2
    socket.on('module2', async (message) => {
      console.log('module2 is called')
      const { option1, option2, draftId } = message
      try {
        const user = await pg.exec('one', 'SELECT setting FROM users WHERE user_id = $1', [id])
        const updated = await pg.exec('one', 'UPDATE users set setting = $2 WHERE user_id = $1 RETURNING setting', [
          id,
          { ...user.setting, records: user.setting.records
            ? [...user.setting.records, { module: '/Module2', field: 'option1', value: option1 }, { module: '/Module2', field: 'option2', value: option2 }, { module: '/Module1', field: 'option1', value: option1 }, { module: '/Module1', field: 'option2', value: option2 }]
            : [{ module: '/Module2', field: 'option1', value: option1 }, { module: '/Module2', field: 'option2', value: option2 }, { module: '/Module1', field: 'option1', value: option1 }, { module: '/Module1', field: 'option2', value: option2 }]
          }
        ])
        io.to(id).emit('me', { records: updated.setting.records })
      } catch (e) {
        if (e) console.log('fail to write search log')
      }

      const ts = Date.now()
      io.to(id).emit('module2', { generating: true, step: '生成產品列表中', process: 0, max: 55, time: 500, topic: option1, purpose: option2, option1, option2, ts, draftId })

      const gptLog = {}
      let limit = 3
      const getProducts = async () => {
        try {
          const p = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              - 確保每一條列的字數在其分析結果中保持一致性，不應有超過30字的差異。
              - 每一分析面向的條列點應「具有獨特性」，「避免內容的重複或過於相似」。
              - 使用標題、副標題、符號列表、粗體，增加內容的組織性和可讀性。
              - 非常重要!! 回答中的品牌必須是 ""實際存在的品牌""，絕對不接受模擬品牌如'品牌A'、'品牌B'、'品牌X'、'品牌1'等。
              
              #Needs:
              競品分析：競品分析需詳細列出內容：品牌名稱、優勢、劣勢、產品特點、價格區間、主要客群、主要客群規模。
                - 請依此格式回答：「1. 品牌名稱: - 優勢:1.優勢一 2.優勢二 3.優勢三 - 劣勢:1.劣勢一 2.劣勢二 3.劣勢三 - 產品特點: - 價格區間: - 主要客群: - 主要客群規模:」
                - 優勢和劣勢各面向分別提供“3點條列”，每點約30字，以「1.」[2.][3.]作為項目符號，並以主動語態、專業、明確的描述方式呈現。
                - 產品特點需考慮品牌特色、客群屬性，提供專業具體的一句描述，30字左右。
                - 價格區間應考慮品牌定位、市場定位及目標客群列出上下限，例如：「$100~$200」或「$30000~$50000」，且需用當地貨幣符號表示。
                - 依據主要客群描述，主要客群規模用1-5來表示大小。
              
              #Goal: 根據上述 #Instructions, #Constraints, #Needs，針對[${option2}]的[${option1}]產業進行深入的「競品分析」，列出[五]個 ""真實存在的"" [${option1}]競品品牌。分析完就停止，不須產生結論。` },
            ],
            () => {},
            () => {},
            3000,
            1
          )

          const d = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              - 確保每一條列的字數在其分析結果中保持一致性，不應有超過30字的差異。
              - 每一分析面向的條列點應「具有獨特性」，「避免內容的重複或過於相似」。
              - 使用標題、副標題、符號列表、粗體，增加內容的組織性和可讀性。
              
              #Needs:
              「產品設計趨勢」與「使用者痛點」：統整並詳述[${option2}]的[${option1}]產業的設計趨勢和使用者痛點，分別5點條列，每列要超過150字。
              `},
            ],
            () => {},
            () => {},
            1500,
            1
          )

          const [products, daw] = await Promise.all([p, d])
          console.log(daw)
          console.log(products)
          gptLog.product = [
            products.substring(products.indexOf('1. 品牌名稱'), products.indexOf('2. 品牌名稱')),
            products.substring(products.indexOf('2. 品牌名稱'), products.indexOf('3. 品牌名稱')),
            products.substring(products.indexOf('3. 品牌名稱'), products.indexOf('4. 品牌名稱')),
            products.substring(products.indexOf('4. 品牌名稱'), products.indexOf('5. 品牌名稱')),
            products.substring(products.indexOf('5. 品牌名稱'), products.length),
          ].map((p) => {
            const name = p.substring(p.indexOf('品牌名稱'), p.indexOf('- 優勢')).replace('品牌名稱', '')
            const advances = p.substring(p.indexOf('- 優勢'), p.indexOf('- 劣勢')).replace('- 優勢', '')
            const weaks = p.substring(p.indexOf('- 劣勢'), p.indexOf('- 產品特點')).replace('- 劣勢', '')
            const sp = p.substring(p.indexOf('- 產品特點'), p.indexOf('- 價格區間')).replace('- 產品特點', '')
            const price = p.substring(p.indexOf('- 價格區間'), p.indexOf('- 主要客群')).replace('- 價格區間', '')
            const audience =  p.substring(p.indexOf('- 主要客群'), p.indexOf('- 主要客群規模')).replace('- 主要客群', '')
            const scale = p.substring(p.indexOf('- 主要客群規模')).replace('- 主要客群規模', '')

            console.log(price)
            const priceRange = trimAll(price).split(',')[0].includes('~') ? trimAll(price).split(',')[0] : `${trimAll(price).split(',')[0] * 0.8}~${trimAll(price).split(',')[0] * 1.2}`
            return [
              trimAll(name),
              [
                trimAll(advances.substring(advances.indexOf('1.') + 2, advances.indexOf('2.'))),
                trimAll(advances.substring(advances.indexOf('2.') + 2, advances.indexOf('3.'))),
                trimAll(advances.substring(advances.indexOf('3.') + 2)),
              ],
              [
                trimAll(weaks.substring(weaks.indexOf('1.') + 2, weaks.indexOf('2.'))),
                trimAll(weaks.substring(weaks.indexOf('2.') + 2, weaks.indexOf('3.'))),
                trimAll(weaks.substring(weaks.indexOf('3.') + 2)),
              ],
              priceRange,
              trimAll(sp),
              trimAll(audience),
              trimAll(scale),
            ]
          })
          const designString = daw.substring(daw.indexOf('產品設計趨勢'), daw.indexOf('使用者痛點')).replace('產品設計趨勢', '')
          const weakString = daw.substring(daw.indexOf('使用者痛點')).replace('使用者痛點', '')

          io.to(id).emit('module2', {
            step: '生成設計趨勢中',
            process: 30,
            max: 55,
            product: gptLog.product,
            matrix: {
              name: '客群大小',
              fields: ['大', '中', '小']
            },
            ts,
            draftId
          })

          // io.to(id).emit('module2', { step: '生成屬性中', ts, draftId })

          const de = Promise.all([
            designString.substring(designString.indexOf('1.') + 2, designString.indexOf('2.')),
            designString.substring(designString.indexOf('2.') + 2, designString.indexOf('3.')),
            designString.substring(designString.indexOf('3.') + 2, designString.indexOf('4.')),
            designString.substring(designString.indexOf('4.') + 2, designString.indexOf('5.')),
            designString.substring(designString.indexOf('5.') + 2),
          ].map(async (d, i) => {
            const title = await getChatResponse(
              [
                { role: 'user', content: `請給這句話一個15個字以內的標題: ${trimAll(d)}`},
              ],
              () => {},
              () => {},
              100,
              1
            )
            return [title, trimAll(d), i + 1]
          }))

          const we = Promise.all([
            weakString.substring(weakString.indexOf('1.') + 2, weakString.indexOf('2.')),
            weakString.substring(weakString.indexOf('2.') + 2, weakString.indexOf('3.')),
            weakString.substring(weakString.indexOf('3.') + 2, weakString.indexOf('4.')),
            weakString.substring(weakString.indexOf('4.') + 2, weakString.indexOf('5.')),
            weakString.substring(weakString.indexOf('5.') + 2),
          ].map(async (w, i) => {
            const title = await getChatResponse(
              [
                { role: 'user', content: `請給這句話一個15個字以內的標題: ${trimAll(w)}`},
              ],
              () => {},
              () => {},
              100,
              1
            )
            return [title, trimAll(w), i + 1]
          }))

          const [design, weak] = await Promise.all([de, we])
          gptLog.design = design
          gptLog.weak = weak
          console.log(gptLog)

          io.to(id).emit('module2', { step: '生成創新方案中', process: 55, max: 80, design: gptLog.design, weak: gptLog.weak, ts, draftId })
          const inovation1 = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              
              {競品分析 內容如下：[${products}]}
              {產品設計趨勢及使用者痛點 內容如下：[產品設計趨勢：${gptLog.design.map((d) => d[0]).join()} 使用者痛點${gptLog.weak.map((w) => w[0]).join()}]}
              
              #Needs:
              未來創新機會方案：綜合上方提供之「競品分析」、「產品設計趨勢」及「使用者痛點」，分析以下四個面向：產品創新、服務創新、商業模式、環境建設，請先以「產品創新」面向提供「3個」具體的切入方案。
                  - 每一個方案描述不少於300字。
                  - 以「1.」[2.][3.]作為項目符號。
              `},
            ],
            () => {},
            () => {},
            1200,
            1
          )
          const inovation2 = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              
              {競品分析 內容如下：[${products}]}
              {產品設計趨勢及使用者痛點 內容如下：[產品設計趨勢：${gptLog.design.map((d) => d[0]).join()} 使用者痛點${gptLog.weak.map((w) => w[0]).join()}]}
              
              #Needs:
              未來創新機會方案：綜合上方提供之「競品分析」、「產品設計趨勢」及「使用者痛點」，分析以下四個面向：產品創新、服務創新、商業模式、環境建設，請先以「服務創新」面向提供「3個」具體的切入方案。
                  - 每一個方案描述不少於300字。
                  - 以「1.」[2.][3.]作為項目符號。
              `},
            ],
            () => {},
            () => {},
            1200,
            1
          )
          const inovation3 = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              
              {競品分析 內容如下：[${products}]}
              {產品設計趨勢及使用者痛點 內容如下：[產品設計趨勢：${gptLog.design.map((d) => d[0]).join()} 使用者痛點${gptLog.weak.map((w) => w[0]).join()}]}
              
              #Needs:
              未來創新機會方案：綜合上方提供之「競品分析」、「產品設計趨勢」及「使用者痛點」，分析以下四個面向：產品創新、服務創新、商業模式、環境建設，請先以「商業模式」面向提供「3個」具體的切入方案。
                  - 每一個方案描述不少於300字。
                  - 以「1.」[2.][3.]作為項目符號。
              `},
            ],
            () => {},
            () => {},
            1200,
            1
          )
          const inovation4 = getChatResponse(
            [
              { role: 'user', content: `#Instructions: 你是一位資深的產業分析師，擅長進行市場調研、競品分析、新產品規劃、創新策略。請遵循以下限制規範和需求目標，進行step-by-step思考並提供你專業且深入的洞見。

              #Constraints:
              - 文體應專業且具描述性(descriptive)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。
              - 內容必須基於真實且正確的資料，不要編撰或創造內容(Do not make information up)。
              - 以#zh-TW繁體中文進行回答，答案中提及的品牌可以是國內或國外的實際品牌，並將貨幣符號保持為簡寫。
              
              {競品分析 內容如下：[${products}]}
              {產品設計趨勢及使用者痛點 內容如下：[產品設計趨勢：${gptLog.design.map((d) => d[0]).join()} 使用者痛點${gptLog.weak.map((w) => w[0]).join()}]}
              
              #Needs:
              未來創新機會方案：綜合上方提供之「競品分析」、「產品設計趨勢」及「使用者痛點」，分析以下四個面向：產品創新、服務創新、商業模式、環境建設，請先以「環境建設」面向提供「3個」具體的切入方案。
                  - 每一個方案描述不少於300字。
                  - 以「1.」[2.][3.]作為項目符號。
              `},
            ],
            () => {},
            () => {},
            1200,
            1
          )
          const inovations = await Promise.all([
            inovation1,
            inovation2,
            inovation3,
            inovation4
          ])
          console.log(inovations)

          io.to(id).emit('module2', { step: '生成圖片中', process: 80, max: 98, ts, draftId })
          const refined = await Promise.all([
            inovations[0].substring(inovations[0].indexOf('1.') + 2, inovations[0].indexOf('2.')).replace('1.', ''),
            inovations[0].substring(inovations[0].indexOf('2.') + 2, inovations[0].indexOf('3.')).replace('2.', ''),
            inovations[0].substring(inovations[0].indexOf('3.') + 2).replace('3.', ''),
            inovations[1].substring(inovations[1].indexOf('1.') + 2, inovations[1].indexOf('2.')).replace('1.', ''),
            inovations[1].substring(inovations[1].indexOf('2.') + 2, inovations[1].indexOf('3.')).replace('2.', ''),
            inovations[1].substring(inovations[1].indexOf('3.') + 2).replace('3.', ''),
            inovations[2].substring(inovations[2].indexOf('1.') + 2, inovations[2].indexOf('2.')).replace('1.', ''),
            inovations[2].substring(inovations[2].indexOf('2.') + 2, inovations[2].indexOf('3.')).replace('2.', ''),
            inovations[2].substring(inovations[2].indexOf('3.') + 2).replace('3.', ''),
            inovations[3].substring(inovations[3].indexOf('1.') + 2, inovations[3].indexOf('2.')).replace('1.', ''),
            inovations[3].substring(inovations[3].indexOf('2.') + 2, inovations[3].indexOf('3.')).replace('2.', ''),
            inovations[3].substring(inovations[3].indexOf('3.') + 2).replace('3.', ''),
          ].map(async (inovation, i) => {
            const t = getChatResponse(
              [
                { role: 'user', content: `請給這句話一個15個字以內的標題: ${trimAll(inovation)}`},
              ],
              () => {},
              () => {},
              100,
              1
            )
            const s = getChatResponse(
              [
                { role: 'user', content: `請為這個方案給予一個評分（範圍從0到5）: ${trimAll(inovation)}`},
              ],
              () => {},
              () => {},
              100,
              1
            )
            const p = getChatResponse(
              [
                { role: 'user', content: `#Instructions: 你是AI繪圖工具的專家，善用 Leonardo AI, Stable Diffusion 這類AI繪圖工具繪製各種「產品設計概念圖」提供設計師創意發想。我將提供你12個創新機會方案，你將產生1組prompt，讓我透過Leonardo AI進行圖片生成。請遵照以下規則產生prompt。
  
                創新機會方案 內容如下：${trimAll(inovation)}
                
                #Prompt Structure:
                1. Product Theme Description: A clear representation of the primary feature of the product combines main subject, design qualities, and intended use case.
                2. Material, Texture, and Finish: Contextual details that contribute to the product's visual and tactile qualities like color, material, texture, style.
                3. Functional Descriptors: Highlights the practical features and unique selling points that address user needs and product longevity.
                4. Style, Camera, Light: Describes the visual style and how the product should be presented, including camera angles, lens types, and lighting details to set the mood and composition of the specific atmosphere, e.g., wide-angle lens, full length shot, cinematic lighting, ray tracing.
                5. Detail and Quality: Stresses the importance of fine detail and overall image quality to enhance the product's representation, e.g., masterpiece, extremely detailed, 4k, beautiful, realistic photography.
                
                #Constraints:
                - 越往前排列的單字是越關鍵的主體、主體特徵，越往後的單字越容易被歸納成風格、裝飾、畫面細節。
                - 依據方案描述內容，每一項方案裡的 prompt 必須和 "[${option2}]" 有關，建議 prompt 能包含 [${option1}] or [${option2}] 的 "英文關鍵字"。
                
                #Needs: 
                - 請將上方提供的12種創新機會方案，依據裡面的 "標題"、"方案描述"，綜合上方 "#Prompt Structure" 以及你所熟知AI繪圖使用的keywords，產生相應的 "英文" 關鍵字組合 prompt。
                - 請直接將12種方案的關鍵字 "組合成一段完整的 prompt"！不需要寫出方案標題、不用介係詞，以逗號連結即可 convert the bulleted keywords into comma-separated。
                - prompt 不超過 50 token。
                - it's very import that don't answer with any chinese word. please answer in english, translate all non-english words into english before you answer.
                `},
              ],
              () => {},
              () => {},
              800,
              1
            )
            const [title, star, prompt] = await Promise.all([t, s, p])
            const pics = await generate(`${prompt},Realism, corridors, natural light`.slice(0, 800), 2)
            return [title, star.match(/\d/)[0], trimAll(inovation), pics[0], pics[1], i + 1]
          }))
          console.log(refined)
          gptLog.inovation = {
            產品創新: refined.slice(0, 3),
            服務創新: refined.slice(3, 6),
            商業模式: refined.slice(6, 9),
            環境建設: refined.slice(9, 12),
          }
          io.to(id).emit('module2', { inovation: gptLog.inovation, generating: false, process: 0, max: 100, ts, draftId })
          return gptLog
        } catch (e) {
          console.log(e)
          if (limit > 0) {
            limit -= 1
            console.log(`retry limit left ${limit}, retrying`)
            const res = await getProducts()
            return res
          } else {
            return {
              matrix: {
                name: '客群大小',
                fields: ['大', '中', '小']
              },
              product: []
            }
          }
        }
      }

      const res = await getProducts()
      console.log(res)
      console.log('-------delaying response-------')
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(2000)
      console.log('-------sending response-------')
      // console.log(res)
      io.to(id).emit('module2', {
        // ...res,
        generating: false,
        t: ts, draftId
      })
    })

    socket.on('module3', async (message) => {
      console.log('module3 is called')
      const { option1, option2, draftId } = message
      try {
        const user = await pg.exec('one', 'SELECT setting FROM users WHERE user_id = $1', [id])
        const updated = await pg.exec('one', 'UPDATE users set setting = $2 WHERE user_id = $1 RETURNING setting', [
          id,
          { ...user.setting, records: user.setting.records
            ? [...user.setting.records, { module: '/Module4', field: 'option1', value: option1 }, { module: '/Module4', field: 'option2', value: option2 }]
            : [{ module: '/Module4', field: 'option1', value: option1 }, { module: '/Module4', field: 'option2', value: option2 }]
          }
        ])
        io.to(id).emit('me', { records: updated.setting.records })
      } catch (e) {
        console.log(e)
        if (e) console.log('fail to write search log')
      }

      const ts = Date.now()
      io.to(id).emit('module3', { step: '生成角色中', process: 0, max: 98, time: 400, generating: true, topic: option1, purpose: option2, option1, option2, ts, draftId })

      let limit = 3
      const trimAll = (s) => s.replaceAll(' ', '').replaceAll('*', '').replaceAll('-', '').replaceAll('#', '').replaceAll('.', '')
      const getPersona = async () => {
        try {
          const personas = await getChatResponse(
            [
              { role: 'user', content: `#1 {Indi Young的書《Mental Models: Aligning Design Strategy with Human Behavior》參考書中 Define Task-Based Audience Segment 章節講解的方法，架構所謂「Mental Model」，先定義使用者，不同於以往的人口研究(demographic)或是心理側寫(psychographic)等方法，Indi Young的Mental Model中使用的是task-based：找出會執行某樣作業的人，不管年齡、職業、性別。} 
              #2 {使用同理心地圖 (Empathy Map)：一個藉由想像自己站在使用者的立場，試著了解他/她最真實的感受，然後思考自己會怎麼做的工具。我們首先要預設這次討論的目標族群資訊，並想像他們可能的行為、反應。} 
              #3 {參考Preece , Rogers and Sharp(2002)列舉下列使用者經驗目標：1.滿意的(Satisfying) 2.樂趣的(Enjoyable) 3.快樂的(Fun) 4.娛樂的(Entertaining) 5.有益的(Helpful) 6.刺激的(Motivating) 7.美的愉悅感(Aesthetically Pleasing) 8.創造力的支援(Supportive of Creativity) 9.實現個人抱負的情感(Emotionally Fulfilling)，進一步描述上面建構作業裡面提到的角色原型：包含他每天可能的生活場景、他每天下班回到家可能要執行的任務與痛點及道具需求} 
              #4 {人物誌（Persona）的功能是為我們的使用者創造「具體形象」。它是一個半虛擬的人物，用來描述使用者的詳細資訊。Well-crafted personas include details about user goals that are similar to those in jobs-to-be-done descriptions, but are enriched with attitudinal, contextual, behavioral, and personal data that can provide a well-rounded set of considerations to guide UX designers and product teams in decision making.}
              #Constraint: 用字精準無贅字、無拼寫錯誤、條理清晰易讀。#zh-TW繁體中文為主，專有名詞、品牌等關鍵字可使用英文。
              #Need: 請依據以上 #1, #2, #3, #4 的參考文獻，以 [${option1}, ${option2}] 為主題，用第一人稱視角生成一份[${option1}]的人物誌(Persona)基本輪廓介紹(short biography)，包含：姓名、年齡、職業描述、喜好。字數不少於50字。
              ` },
            ],
            () => {},
            () => {},
            1000,
            1
          )
          const name = trimAll(personas.substring(personas.indexOf('姓名'), personas.indexOf('年齡')))
          const age = trimAll(personas.substring(personas.indexOf('年齡'), personas.indexOf('職業')))
          const lists = await getChatResponse(
            [
              { role: 'user', content: `#1 {人物誌（Persona）的功能是為我們的使用者創造「具體形象」。它是一個半虛擬的人物，用來描述使用者的詳細資訊。
                完整的人物誌（Persona）有以下「11項」條列資訊： 
                1. 個人資料（姓名、性別、年齡、居住地、婚姻狀況、座右銘） 
                2. 個性（價值觀） 
                3. 生活目標與需求
                4. 工作痛點、挑戰（可能的工作風險、可能的情緒變化、可能取得的專業機構協助）
                5. 消費取向（可能喜歡的品牌併進一步說明產品特色）
                6. 可能工作職能發展需求
                7. 可能的投資偏好
                8. 可能閱讀的媒體與資訊來源
                9. 可能會購買的消費性電子產品
                10. 可能使用的社群平台 (ex: meta,IG,twitter..)
                11. 日常生活的細節
                }
                #Constraint: 用字精準無贅字、無拼寫錯誤、條理清晰易讀。#zh-TW繁體中文為主，品牌等關鍵字可使用英文。
                #Need: 請依據 #1 的知識，以 [${option1}, ${option2}] 為主題，用第一人稱視角生成姓名為${name}且年齡為${age}的人物誌(Persona)的「11項」條列。以「1.」「2.」「3.」作為項目符號，每項字數不少於40字。
              ` },
            ],
            () => {},
            () => {},
            1400,
            1
          )
          console.log(lists)
          const strings = [
            trimAll(lists.substring(lists.indexOf('1.') + 2, lists.indexOf('2.'))).replace('1.', ''),
            trimAll(lists.substring(lists.indexOf('2.') + 2, lists.indexOf('3.'))).replace('2.', ''),
            trimAll(lists.substring(lists.indexOf('3.') + 2, lists.indexOf('4.'))).replace('3.', ''),
            trimAll(lists.substring(lists.indexOf('4.') + 2, lists.indexOf('5.'))).replace('4.', ''),
            trimAll(lists.substring(lists.indexOf('5.') + 2, lists.indexOf('6.'))).replace('5.', ''),
            trimAll(lists.substring(lists.indexOf('6.') + 2, lists.indexOf('7.'))).replace('6.', ''),
            trimAll(lists.substring(lists.indexOf('7.') + 2, lists.indexOf('8.'))).replace('7.', ''),
            trimAll(lists.substring(lists.indexOf('8.') + 2, lists.indexOf('9.'))).replace('8.', ''),
            trimAll(lists.substring(lists.indexOf('9.') + 2, lists.indexOf('10.'))).replace('9.', ''),
            trimAll(lists.substring(lists.indexOf('10.') + 3, lists.indexOf('11.'))).replace('10.', ''),
            trimAll(lists.substring(lists.indexOf('11.') + 3)).replace('11.', ''),
          ]
          let pics = ['','','','']
          try {
            const p = await getChatResponse(
              [
                { role: 'user', content: `#Instructions: 你是AI繪圖工具的專家，善用 Leonardo AI, Stable Diffusion 這類AI繪圖工具繪製各種「產品設計概念圖」提供設計師創意發想。我將提供你12個創新機會方案，你將產生1組prompt，讓我透過Leonardo AI進行圖片生成。請遵照以下規則產生prompt。
                
                #Prompt Structure:
                1. Product Theme Description: A clear representation of the primary feature of the product combines main subject, design qualities, and intended use case.
                2. Material, Texture, and Finish: Contextual details that contribute to the product's visual and tactile qualities like color, material, texture, style.
                3. Functional Descriptors: Highlights the practical features and unique selling points that address user needs and product longevity.
                4. Style, Camera, Light: Describes the visual style and how the product should be presented, including camera angles, lens types, and lighting details to set the mood and composition of the specific atmosphere, e.g., wide-angle lens, full length shot, cinematic lighting, ray tracing.
                5. Detail and Quality: Stresses the importance of fine detail and overall image quality to enhance the product's representation, e.g., masterpiece, extremely detailed, 4k, beautiful, realistic photography.
                
                #Constraints:
                - 越往前排列的單字是越關鍵的主體、主體特徵，越往後的單字越容易被歸納成風格、裝飾、畫面細節。
                - 依據方案描述內容，每一項方案裡的 prompt 必須和 "[${option2}]" 有關，建議 prompt 能包含 [${option1}] or [${option2}] 的 "英文關鍵字"。
                
                #Needs: 
                - 請將這段文字「[${option1},${option2}] Showing flexible body movements and scene details of [${option1}] and attitude at work, and enhancing the expression of facial emotions, 8K UHD, real world, dramatic lighting, 90s, far field of view.」中的中文翻譯成英文後，綜合上方 "#Prompt Structure" 以及你所熟知AI繪圖使用的keywords，產生相應的 "英文" 關鍵字組合 prompt。
                - 請直接將關鍵字 "組合成一段完整的 prompt"！不需要寫出方案標題、不用介係詞，以逗號連結即可 convert the bulleted keywords into comma-separated。
                - prompt 不超過 50 token。
                - it's very import that don't answer with any chinese word. please answer in english, translate all non-english words into english before you answer.
                `},
              ],
              () => {},
              () => {},
              800,
              1
            )
            pics = await generate(p, 4)
          } catch (e) {
            console.log(e)
          }
          console.log(pics)
          console.log(personas)
          console.log(strings)
          io.to(id).emit('module3', { persona: [`${name}`, ...strings, personas], process: 0, max: 100, pics, generating: false, t: ts, draftId })
        } catch (e) {
          console.log(e)
          if (limit > 0) {
            limit -= 1
            console.log(`retry limit left ${limit}, retrying`)
            getPersona()
          } else {
            io.to(id).emit('module3', { generating: false, t: ts, draftId })
          }
        }
      }
      getPersona()
    })

    socket.on('module4', async (message) => {
      console.log('module4 is called')
      const { option1, option2, draftId } = message
      try {
        const user = await pg.exec('one', 'SELECT setting FROM users WHERE user_id = $1', [id])
        const updated = await pg.exec('one', 'UPDATE users set setting = $2 WHERE user_id = $1 RETURNING setting', [
          id,
          { ...user.setting, records: user.setting.records
            ? [...user.setting.records, { module: '/Module3', field: 'option1', value: option1 }, { module: '/Module3', field: 'option2', value: option2 }]
            : [{ module: '/Module3', field: 'option1', value: option1 }, { module: '/Module3', field: 'option2', value: option2 }]
          }
        ])
        io.to(id).emit('me', { records: updated.setting.records })
      } catch (e) {
        console.log(e)
        if (e) console.log('fail to write search log')
      }
      const ts = Date.now()
      io.to(id).emit('module4', { generating: true, step: '生成故事中', process: 0, max: 25, time: 300, topic: option1, purpose: option2, option1, option2, ts, draftId })

      const story = await getChatResponse(
        [
          { role: 'user', content: `#Instructions: I want you to act as a UX researcher. I will provide some details about 'How to create a persona/user scenarios', and it will be your job to gain a comprehensive understanding of the customer experience. My first request is "I need a best practices for creating user personas to guide design decisions on different user and task i.e. [產品設計師, 任務是設計高檔商務用的膠囊咖啡機產品]."
          #1 {Indi Young的書《Mental Models: Aligning Design Strategy with Human Behavior》參考書中 Define Task-Based Audience Segment 章節講解的方法，架構所謂「Mental Model」，先定義使用者，不同於以往的人口研究(demographic)或是心理側寫(psychographic)等方法，Indi Young的Mental Model中使用的是task-based：找出會執行某樣作業的人，不管年齡、職業、性別。} 
          #2 {藉由想像自己站在使用者的立場，試著了解他/她最真實的感受，然後思考自己會怎麼做並描繪使用者同理心地圖 (Empathy Map)，預設這次目標族群 [${option1}, 任務是${option2}] 資訊，並想像他們可能的行為、反應。} 
          #3 {參考Preece , Rogers and Sharp(2002)列舉下列使用者經驗目標：1.滿意的(Satisfying) 2.樂趣的(Enjoyable) 3.快樂的(Fun) 4.娛樂的(Entertaining) 5.有益的(Helpful) 6.刺激的(Motivating) 7.美的愉悅感(Aesthetically Pleasing) 8.創造力的支援(Supportive of Creativity) 9.實現個人抱負的情感(Emotionally Fulfilling)，進一步描述 [產品設計師, 任務是分析膠囊咖啡機市場機會] 的角色原型：包含他每天可能的生活場景、他每天下班回到家可能要執行的任務與痛點及道具需求} 
          #4 {人物誌（Persona）的功能是為我們的使用者創造「具體形象」，它是一個半虛擬的人物，用來描述使用者的詳細資訊。完整的人物誌（Persona）需考慮以下內容： 
            - 個人資料（姓名、性別、年齡、住址、婚姻狀況、座右銘） 
            - 個性（價值觀） 
            - 任務目標與需求，Goals and concerns when they perform relevant 任務(tasks): speed, accuracy, thoroughness, or any other needs that may factor into their usage
            - 進行任務過程的痛點及挑戰（可能的工作風險、可能的情緒變化、可能取得的專業機構協助）
            - Create a believable and alive character. Avoid adding extraneous details that do not have any implications for design.}
          #Constraint: 文體具敘事性(narrative)，用字精準無贅字、無拼寫錯誤、清晰易讀。#zh-TW繁體中文為主，專有名詞、品牌等關鍵字可使用英文。
          #Need: 請依據以上 #1, #2, #3, #4 的方法論，並以 [${option1}, 任務是${option2}] 為題目，用"一整篇不分段的文章"來描述該 Persona，角色需包含：姓名、年齡、性別。Persona 總字數不少於250字，不多於500字。不需解釋也不要結語，""請直接給我Persona描述""。` },
        ],
        () => {},
        () => {},
        800,
        1
      )
      io.to(id).emit('module4', { storys: [story], step: '生成地圖中', process: 25, max: 38, t: ts, draftId })
      console.log(story)
      const maps = await getChatResponse(
        [
          { role: 'user', content: `#Instructions: I want you to act as a UX researcher. I will provide some details about 'How to create a customer journey map', and it will be your job to use customer journey mapping to gain a comprehensive understanding of the customer experience. My first request is 'I need a best practices for creating user journeys based on user personas.'

          #1 {顧客旅程地圖參考文獻：How to create a customer journey map?
            1.Define the behavioral stages.
            Depending on [${option1}], customers may go through different stages while navigating your site. A B2C ecommerce company may have just a few clearly defined phases; a B2B SaaS company selling to the Fortune 100 may have more.
            [${option1}] personas should give you a pretty good idea of the process that customers go through from their first landing to an eventual purchase and subsequent interactions. The next step identifies which interactions fit into which stages.
          
            2.Align customer goals with each stage.
            What do customers want to achieve as they move through each behavioral stage? You can mine a number of data sources to get that information:
            • Survey answers;
            • User testing;
            • Interview transcripts;
            • Customer service emails or support transcripts.
            Then, you’ll be able to see if your website supports each of those goals.
          
            3.Plot the touchpoints.
            Think of touchpoints as places where customers engage with your site and where you support the completion of their goals. These touchpoints will be grouped under the relevant stage in your customer’s journey. For retailers, a common touchpoint might be a product description page; for a service business, it may anything from a pricing page to a contact form. You can identify touchpoints along the user journey in two reports in Google Analytics:
            • Behavior Flow report;
            • Goal flow report.
            You’ll be able to determine if users—or a subset of them—are unexpectedly leaving in the middle of their journey on the path to the goal, or if there’s a place where your traffic loops back.
          
            4.Determine if customers achieve their goals.
            This is where you take the data you’ve collected and measure it against how easily your customers can get done what they need to do. Ask yourself the following types of questions:
            • Where are there roadblocks?
            • Do tons of people abandon their carts on the checkout page?
            • Do users go to your opt-in download page but not fill out the form?
            The Google Analytics reports you’ve mined for insights will show you where issues crop up. The existing qualitative research you have—the same research you used to build your personas—should help you understand the why behind the problems.
            Analyze the actions (or lack thereof) of your customers. How well are their needs met at each touchpoint and during each phase?
          
            5.Effective customer journey mapping follows five key high-level steps:
            • Aspiration and allies: Building a core cross disciplinary team and defining the scope of the mapping initiative
            • Internal investigation: Gathering existing customer data and research that exists throughout the organization
            • Assumption formulation: Formulating a hypothesis of the current state of the journey and planning additional customer research
            • External research: Collecting new user data to validate (or invalidate) the hypothesis journey map
            • Narrative visualization: Combining existing insights and new research to create a visual narrative that depicts the customer journey in a sound way
          } 
          #Constraint: 文體具敘事性(narrative)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。#zh-TW繁體中文為主，專有名詞、品牌等關鍵字可使用英文。
          #Need: 請依據#1的參考文獻，並參考下方Persona，以 [${option1}, 任務是${option2}] 為主題，條列出「五個」「接觸點 (touchpoints)」。每個條列內容需包含Persona角色之姓名、任務。各別條列不少於200字，不多於300字。
          {Persona 內容如下：[${story}]}` },
        ],
        () => {},
        () => {},
        1000,
        1
      )
      console.log(maps)
      io.to(id).emit('module4', { events: [
        maps.substring(maps.indexOf('1.') + 2, maps.indexOf('2.')),
        maps.substring(maps.indexOf('2.') + 2, maps.indexOf('3.')),
        maps.substring(maps.indexOf('3.') + 2, maps.indexOf('4.')),
        maps.substring(maps.indexOf('4.') + 2, maps.indexOf('5.')),
        maps.substring(maps.indexOf('5.') + 2),
      ], step: '生成道具中', process: 38, max: 51, t: ts, draftId })
      const items = await getChatResponse(
        [
          { role: 'user', content: `#Instructions: I want you to act as a UX researcher. I will provide some details about 'How to create a customer journey map', and it will be your job to use customer journey mapping to gain a comprehensive understanding of the customer experience. My first request is 'I need a best practices for creating user journeys based on user personas and touchpoints.'
          #1 {顧客旅程地圖參考文獻：How to create a customer journey map?
            Effective customer journey mapping follows five key high-level steps:
            • Aspiration and allies: Building a core cross disciplinary team and defining the scope of the mapping initiative
            • Internal investigation: Gathering existing customer data and research that exists throughout the organization
            • Assumption formulation: Formulating a hypothesis of the current state of the journey and planning additional customer research
            • External research: Collecting new user data to validate (or invalidate) the hypothesis journey map
            • Narrative visualization: Combining existing insights and new research to create a visual narrative that depicts the customer journey in a sound way
          } 
          {Persona 內容如下：[${story}]}
          {Touchpoints 內容如下：[${maps}]}
          #Constraint: 文體具敘事性(narrative)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。#zh-TW繁體中文為主，專有名詞、品牌等關鍵字可使用英文。          
          #Need: 請依據#1的參考文獻，並參考上方提供的Persona, 基於各階段Touchpoints，以 [${option1}, 任務是${option2}] 為主題，條列出「五個」「使用者的道具需求與可能接觸的角色」。每個條列內容需包含Persona角色之姓名。各別條列不少於150字。開頭為：「(角色姓名)在此階段，可能需要…」。` },
        ],
        () => {},
        () => {},
        1000,
        1
      )
      console.log(items)
      io.to(id).emit('module4', { contacts: [
        items.substring(items.indexOf('1.') + 2, items.indexOf('2.')),
        items.substring(items.indexOf('2.') + 2, items.indexOf('3.')),
        items.substring(items.indexOf('3.') + 2, items.indexOf('4.')),
        items.substring(items.indexOf('4.') + 2, items.indexOf('5.')),
        items.substring(items.indexOf('5.') + 2),
      ], step: '生成機會中', process: 51, max: 70, t: ts, draftId })
      const ows = await getChatResponse(
        [
          { role: 'user', content: `#1 {Opportunities (along with additional context such as ownership and metrics) are insights gained from mapping; they speak to how the user experience can be optimized. Insights and opportunities help the team draw knowledge from the map:
            - What needs to be done with this knowledge?
            - Who owns what change?
            - Where are the biggest opportunities?
            - How are we going to measure improvements we implement?
            }
            {Touchpoints 內容如下：[${maps}]}
            {Interactions 內容如下：[${items}]}
            #Constraint: 文體具敘事性(narrative)，用字精準無贅字、無拼寫錯誤、條理清晰易讀。#zh-TW繁體中文為主，專有名詞、品牌等關鍵字可使用英文。            
            #Need: 請依據#1的參考文獻，並基於上方提供的Persona, Touchpoints, Interactions，以 [${option1}, 任務是${option2}] 為主題，條列出「五個」「人物可能的痛點與機會點」。每個條列內容需包含Persona角色之姓名、任務。各別條列不少於150字。` },
        ],
        () => {},
        () => {},
        1000,
        1
      )
      console.log(ows)
      io.to(id).emit('module4', { ows: [
        ows.substring(ows.indexOf('1.') + 2, ows.indexOf('2.')),
        ows.substring(ows.indexOf('2.') + 2, ows.indexOf('3.')),
        ows.substring(ows.indexOf('3.') + 2, ows.indexOf('4.')),
        ows.substring(ows.indexOf('4.') + 2, ows.indexOf('5.')),
        ows.substring(ows.indexOf('5.') + 2),
      ], step: '生成情緒中', process: 70, max: 99, t: ts, draftId })
      const emotions = await getChatResponse(
        [
          { role: 'user', content: `#1 {Thoughts and feelings: what the customer thinks and feels at each touchpoint.
            Emotions are plotted as a single line across the journey phases, literally signaling the emotional “ups” and “downs” of the experience. Think of this line as a contextual layer of emotion that tells us where the user is delighted versus frustrated.
            }
            {Persona 內容如下：[${story}]}
            {Touchpoints 內容如下：[${maps}]}
            #Instructions: I want you to act as a UX researcher with a specialization in customer journey mapping. My primary role is to analyze user perosna and touchpoints. These touchpoints focus on the emotional journey of the [${option1}] encounter with a [任務是${option2}] task, ranging from -2 (negative emotion) to 2 (positive emotion).            
            #Constraints: The journey includes at least 5 stages, with some stages intentionally negative to reflect realistic user experiences.
            #Need: 請依據#1的參考文獻、參考上方提供的 Persona，並基於上方提供的 Touchpoints 五個階段，依據各階段的情緒體驗，分別給一個「分數 (emotion score)」：positive emotion 最高給2分，negative emotion 最低給-2分。用「1.」「2.」「3.」作為項目符號，無須任何描述「只須給我分數即可」。
            ` },
        ],
        () => {},
        () => {},
        1000,
        1
      )
      const p = await getChatResponse(
        [
          { role: 'user', content: `#Instructions: 你是AI繪圖工具的專家，善用 Leonardo AI, Stable Diffusion 這類AI繪圖工具繪製各種「產品設計概念圖」提供設計師創意發想。我將提供你12個創新機會方案，你將產生1組prompt，讓我透過Leonardo AI進行圖片生成。請遵照以下規則產生prompt。
          
          #Prompt Structure:
          1. Product Theme Description: A clear representation of the primary feature of the product combines main subject, design qualities, and intended use case.
          2. Material, Texture, and Finish: Contextual details that contribute to the product's visual and tactile qualities like color, material, texture, style.
          3. Functional Descriptors: Highlights the practical features and unique selling points that address user needs and product longevity.
          4. Style, Camera, Light: Describes the visual style and how the product should be presented, including camera angles, lens types, and lighting details to set the mood and composition of the specific atmosphere, e.g., wide-angle lens, full length shot, cinematic lighting, ray tracing.
          5. Detail and Quality: Stresses the importance of fine detail and overall image quality to enhance the product's representation, e.g., masterpiece, extremely detailed, 4k, beautiful, realistic photography.
          
          #Constraints:
          - 越往前排列的單字是越關鍵的主體、主體特徵，越往後的單字越容易被歸納成風格、裝飾、畫面細節。
          - 依據方案描述內容，每一項方案裡的 prompt 必須和 "[${option2}]" 有關，建議 prompt 能包含 [${option1}] or [${option2}] 的 "英文關鍵字"。
          
          #Needs: 
          - 請將這段文字「Possible details of the scene of [${option1},${option2}] are presented from a third-person perspective, including [${option1}]’s partners in performing tasks and the tools and operational details needed to perform [${option2}], as well as the scene’s picture and style design. Set to 8K UHD, real world, dramatic lighting, 90s, far field of view. elegant, super-detailed, very verbose, Style Med = –s 100.」中的中文翻譯成英文後，綜合上方 "#Prompt Structure" 以及你所熟知AI繪圖使用的keywords，產生相應的 "英文" 關鍵字組合 prompt。
          - 請直接將關鍵字 "組合成一段完整的 prompt"！不需要寫出方案標題、不用介係詞，以逗號連結即可 convert the bulleted keywords into comma-separated。
          - prompt 不超過 50 token。
          - it's very import that don't answer with any chinese word. please answer in english, translate all non-english words into english before you answer.
          `},
        ],
        () => {},
        () => {},
        800,
        1
      )
      const pics = await generate(p.slice(0, 800), 1)
      console.log(emotions)
      const es = [
        emotions.substring(emotions.indexOf('1.') + 2, emotions.indexOf('2.')),
        emotions.substring(emotions.indexOf('2.') + 2, emotions.indexOf('3.')),
        emotions.substring(emotions.indexOf('3.') + 2, emotions.indexOf('4.')),
        emotions.substring(emotions.indexOf('4.') + 2, emotions.indexOf('5.')),
        emotions.substring(emotions.indexOf('5.') + 2)
      ]
      const ces = es.map((e) => {
        const temp = parseInt(e.replace('：', ':').split(':')[1] || e.replace('：', ':').split(':')[0])
        return isFinite(temp) ? Math.min(Math.max(-2, temp), 2) : 0
      })
      io.to(id).emit('module4', { emotions: ces, pics, generating: false, process: 0, max: 100, t: ts, draftId })
    })
  })
  socket.io = io
}

module.exports = socket
