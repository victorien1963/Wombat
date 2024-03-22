/* eslint-disable prefer-destructuring */
import ExcelJS from 'exceljs'

const toDataURL = (url, callback) => {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}

const addPic = (workbook, pics, results, index, callback) => {
  if (!pics[index]) callback(results)
  else
    toDataURL(pics[index], (dataUrl) => {
      if (!pics[index]) {
        addPic(workbook, pics, [...results, ''], index + 1, callback)
      } else {
        const image = workbook.addImage({
          base64: dataUrl,
          extension: 'png',
        })
        addPic(workbook, pics, [...results, image], index + 1, callback)
      }
    })
}

const handleDownload = async (
  workbook,
  pics,
  { module1, module2, module3, module4 },
  modules,
  callback
) => {
  console.log('-----------end pic job-------------')
  if (modules.includes('module1')) {
    const sheet1 = workbook.addWorksheet('模組一', {
      headerFooter: {
        firstHeader: `模組一`,
      },
    })
    sheet1.getColumn(2).width = 25
    sheet1.getColumn(3).width = 75
    sheet1.getCell(`B1`).value = '標籤'
    sheet1.getCell(`C1`).value = '說明'
    Object.keys(module1)
      .filter((key) => module1[key].forEach)
      .forEach((key, i) => {
        sheet1.getCell(`A${2 + i * 3}`).value = key
        sheet1.getCell(`A${2 + i * 3}`).alignment = { vertical: 'middle' }
        sheet1.mergeCells(`A${2 + i * 3}`, `A${4 + i * 3}`)
        module1[key].forEach(([tag, content], j) => {
          sheet1.getRow(j + 2 + i * 3).height = 90
          sheet1.getCell(`B${j + 2 + i * 3}`).value = tag
          sheet1.getCell(`B${j + 2 + i * 3}`).alignment = {
            wrapText: true,
            vertical: 'middle',
          }
          sheet1.getCell(`C${j + 2 + i * 3}`).value = content
          sheet1.getCell(`C${j + 2 + i * 3}`).alignment = { wrapText: true }
        })
      })
  }
  console.log('-----------end module1 job-------------')
  if (modules.includes('module2')) {
    const sheet2 = workbook.addWorksheet('競品分析', {
      headerFooter: {
        firstHeader: `模組二`,
      },
    })
    sheet2.getCell(`A1`).value = '品牌名稱'
    sheet2.getCell(`B1`).value = '優勢'
    sheet2.getCell(`C1`).value = '劣勢'
    sheet2.getCell(`D1`).value = '價格區間'
    sheet2.getCell(`E1`).value = '產品特點'
    sheet2.getCell(`F1`).value = '主要客群'

    const product = module2.product || [
      ['', ['', '', ''], ['', '', ''], '', '', ''],
      ['', ['', '', ''], ['', '', ''], '', '', ''],
      ['', ['', '', ''], ['', '', ''], '', '', ''],
      ['', ['', '', ''], ['', '', ''], '', '', ''],
      ['', ['', '', ''], ['', '', ''], '', '', ''],
    ]
    product.forEach((p, i) => {
      sheet2.mergeCells(`A${i * 3 + 2}`, `A${i * 3 + 4}`)
      sheet2.mergeCells(`D${i * 3 + 2}`, `D${i * 3 + 4}`)
      sheet2.mergeCells(`E${i * 3 + 2}`, `E${i * 3 + 4}`)
      sheet2.mergeCells(`F${i * 3 + 2}`, `F${i * 3 + 4}`)
      sheet2.getCell(`A${i * 3 + 2}`).value = p[0]
      sheet2.getCell(`B${i * 3 + 2}`).value = p[1][0]
      sheet2.getCell(`B${i * 3 + 3}`).value = p[1][1]
      sheet2.getCell(`B${i * 3 + 4}`).value = p[1][2]
      sheet2.getCell(`C${i * 3 + 2}`).value = p[2][0]
      sheet2.getCell(`C${i * 3 + 3}`).value = p[2][1]
      sheet2.getCell(`C${i * 3 + 4}`).value = p[2][2]
      sheet2.getCell(`D${i * 3 + 2}`).value = p[3]
      sheet2.getCell(`E${i * 3 + 2}`).value = p[4]
      sheet2.getCell(`F${i * 3 + 2}`).value = p[5]
    })

    const sheet3 = workbook.addWorksheet('設計趨勢', {
      headerFooter: {
        firstHeader: `模組二`,
      },
    })
    sheet3.getColumn(1).width = 30
    sheet3.getColumn(2).width = 50
    sheet3.getCell(`A1`).value = '標題'
    sheet3.getCell(`B1`).value = '內容'
    const design = module2.design || [
      ['', '', 0],
      ['', '', 1],
      ['', '', 2],
      ['', '', 3],
    ]
    design.forEach((d, i) => {
      sheet3.getCell(`A${i + 1}`).value = d[0]
      sheet3.getCell(`B${i + 1}`).value = d[1]
      sheet3.getCell(`A${i + 1}`).alignment = {
        vertical: 'middle',
      }
      sheet3.getCell(`B${i + 1}`).alignment = {
        wrapText: true,
        vertical: 'top',
      }
    })

    const sheet4 = workbook.addWorksheet('痛點分析', {
      headerFooter: {
        firstHeader: `模組二`,
      },
    })
    sheet4.getColumn(1).width = 30
    sheet4.getColumn(2).width = 50
    sheet4.getCell(`A1`).value = '標題'
    sheet4.getCell(`B1`).value = '內容'
    const weak = module2.weak || [
      ['', '', 0],
      ['', '', 1],
      ['', '', 2],
      ['', '', 3],
    ]
    weak.forEach((w, i) => {
      sheet4.getCell(`A${i + 1}`).value = w[0]
      sheet4.getCell(`B${i + 1}`).value = w[1]
      sheet4.getCell(`A${i + 1}`).alignment = {
        vertical: 'middle',
      }
      sheet4.getCell(`B${i + 1}`).alignment = {
        wrapText: true,
        vertical: 'top',
      }
    })

    const sheet5 = workbook.addWorksheet('創新機會', {
      headerFooter: {
        firstHeader: `模組二`,
      },
    })
    const inovation = module2.inovation || {
      產品創新: [],
      服務創新: [],
      商業模式: [],
      環境建設: [],
    }
    sheet5.getColumn(1).width = 50
    sheet5.getColumn(2).width = 50
    sheet5.getColumn(3).width = 50
    const keys = ['產品創新', '服務創新', '商業模式', '環境建設']
    keys.forEach((key, i) => {
      sheet5.getRow(i * 5 + 1).height = 25
      sheet5.getRow(i * 5 + 2).height = 25
      sheet5.getCell(`A${i * 5 + 1}`).value = key
      sheet5.getCell(`A${i * 5 + 2}`).value = '標題'
      sheet5.getCell(`B${i * 5 + 2}`).value = '推薦度'
      sheet5.getCell(`C${i * 5 + 2}`).value = '內容'
      sheet5.getCell(`D${i * 5 + 2}`).value = '圖一'
      sheet5.getCell(`E${i * 5 + 2}`).value = '圖二'
      inovation[key].forEach((w, j) => {
        sheet5.getCell(`A${i * 5 + j + 3}`).value = w[0]
        sheet5.getCell(`B${i * 5 + j + 3}`).value = w[1]
        sheet5.getCell(`C${i * 5 + j + 3}`).value = w[2]
        sheet5.getCell(`A${i * 5 + j + 3}`).alignment = {
          wrapText: true,
          vertical: 'middle',
        }
        sheet5.getCell(`B${i * 5 + j + 3}`).alignment = {
          wrapText: true,
          vertical: 'top',
        }
        sheet5.getCell(`C${i * 5 + j + 3}`).alignment = {
          wrapText: true,
          vertical: 'top',
        }
        sheet5.getCell(`D${i * 5 + j + 3}`).value = w[3]
        sheet5.getCell(`E${i * 5 + j + 3}`).value = w[4]
        sheet5.getRow(i * 5 + j + 3).height = 128
        sheet5.getColumn(4).width = 32
        sheet5.getColumn(5).width = 32
        if (pics[i * 6 + j * 2] !== undefined)
          sheet5.addImage(pics[i * 6 + j * 2], {
            tl: { col: 3, row: i * 5 + j + 2 },
            ext: { width: 128, height: 128 },
          })
        if (pics[i * 6 + j * 2 + 1] !== undefined)
          sheet5.addImage(pics[i * 6 + j * 2 + 1], {
            tl: { col: 4, row: i * 5 + j + 2 },
            ext: { width: 128, height: 128 },
          })
      })
    })
  }

  if (modules.includes('module4')) {
    const sheet7 = workbook.addWorksheet('模組三', {
      headerFooter: {
        firstHeader: `模組三`,
      },
    })
    sheet7.getRow(1).height = 128
    sheet7.getColumn(1).width = 32
    const base =
      (modules.includes('module2') ? 24 : 1) +
      (modules.includes('module3') ? 4 : 0)
    if (pics[base])
      sheet7.addImage(base, {
        tl: { col: 0, row: 0 },
        ext: { width: 128, height: 128 },
      })
    sheet7.getCell(`A1`).value =
      module4.pics && module4.pics[0] ? module4.pics[0] : ''
    sheet7.mergeCells('A2', 'E2')
    sheet7.getCell(`A2`).value = '故事描述'
    sheet7.mergeCells('A3', 'E3')
    sheet7.getCell(`A3`).value = module4.storys ? module4.storys[0] : ''
    sheet7.getCell(`A4`).value = '故事點一'
    sheet7.getCell(`B4`).value = '故事點二'
    sheet7.getCell(`C4`).value = '故事點三'
    sheet7.getCell(`D4`).value = '故事點四'
    sheet7.getCell(`E4`).value = '故事點五'

    const events = module4.events || ['', '', '', '', '']
    sheet7.getCell('A5').value = events[0]
    sheet7.getCell('B5').value = events[1]
    sheet7.getCell('C5').value = events[2]
    sheet7.getCell('D5').value = events[3]
    sheet7.getCell('E5').value = events[4]

    const contacts = module4.contacts || ['', '', '', '', '']
    sheet7.getCell('A6').value = contacts[0]
    sheet7.getCell('B6').value = contacts[1]
    sheet7.getCell('C6').value = contacts[2]
    sheet7.getCell('D6').value = contacts[3]
    sheet7.getCell('E6').value = contacts[4]

    const ows = module4.ows || ['', '', '', '', '']
    sheet7.getCell('A7').value = ows[0]
    sheet7.getCell('B7').value = ows[1]
    sheet7.getCell('C7').value = ows[2]
    sheet7.getCell('D7').value = ows[3]
    sheet7.getCell('E7').value = ows[4]
  }
  console.log('-----------end module3 job-------------')
  if (modules.includes('module3')) {
    const sheet6 = workbook.addWorksheet('模組四', {
      headerFooter: {
        firstHeader: `模組四`,
      },
    })
    const ps = module3.pics || ['', '', '', '']
    sheet6.getCell(`A1`).value = ps[0]
    sheet6.getCell(`B1`).value = ps[1]
    sheet6.getCell(`A2`).value = ps[2]
    sheet6.getCell(`B2`).value = ps[3]
    const persona = module3.persona || []
    persona.forEach((p, i) => {
      sheet6.getCell(`A${i + 3}`).value = p
    })
    sheet6.getRow(1).height = 128
    sheet6.getRow(2).height = 128
    sheet6.getColumn(1).width = 32
    sheet6.getColumn(2).width = 32

    const base = modules.includes('module2') ? 24 : 1
    if (pics[base])
      sheet6.addImage(base, {
        tl: { col: 0, row: 0 },
        ext: { width: 128, height: 128 },
      })
    if (pics[base + 1])
      sheet6.addImage(base + 1, {
        tl: { col: 0, row: 1 },
        ext: { width: 128, height: 128 },
      })
    if (pics[base + 2])
      sheet6.addImage(base + 2, {
        tl: { col: 1, row: 0 },
        ext: { width: 128, height: 128 },
      })
    if (pics[base + 3])
      sheet6.addImage(base + 3, {
        tl: { col: 1, row: 1 },
        ext: { width: 128, height: 128 },
      })
  }
  console.log('-----------end module4 job-------------')

  console.log('-----------start downloading-------------')
  const file = await workbook.xlsx.writeBuffer({
    base64: true,
  })
  const excel = new Blob([file], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(excel)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `匯出.xlsx`)
  document.body.appendChild(link)

  const downloadFunc = () => {
    link.click()
    link.remove()
  }
  console.log('-----------end downloading-------------')
  callback(downloadFunc)
}

const makeFile = (
  { module1, module2, module3, module4 },
  modules = [],
  callback = () => {}
) => {
  try {
    const images = []
    if (modules.includes('module2')) {
      const inovation = module2.inovation || {
        產品創新: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
        服務創新: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
        商業模式: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
        環境建設: [
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
        ],
      }
      const keys = ['產品創新', '服務創新', '商業模式', '環境建設']
      keys.forEach((key) => {
        images.push(inovation[key][0][3])
        images.push(inovation[key][0][4])
        images.push(inovation[key][1][3])
        images.push(inovation[key][1][4])
        images.push(inovation[key][2][3])
        images.push(inovation[key][2][4])
      })
    }
    if (modules.includes('module3')) {
      const module3Pics = module3.pics || ['', '', '', '']
      module3Pics.forEach((pic) => images.push(pic))
    }
    if (modules.includes('module4')) {
      const module4Pics = module4.pics || ['']
      module4Pics.forEach((pic) => images.push(pic))
    }
    const workbook = new ExcelJS.Workbook()
    addPic(workbook, images, [], 0, (results) =>
      handleDownload(
        workbook,
        results,
        {
          module1,
          module2,
          module3,
          module4,
        },
        modules,
        callback
      )
    )
  } catch (e) {
    console.log(e)
  }
}

const readFile = (file, modules = [], callback = () => {}) => {
  const reader = new FileReader()
  reader.onload = (f) => {
    const workbook = new ExcelJS.Workbook()
    console.log('-----------start uploading-------------')
    workbook.xlsx.load(f.target.result).then((result) => {
      console.log('-----------File loaded-------------')
      const sheet1 = result.getWorksheet('模組一')
      const sheet2 = result.getWorksheet('競品分析')
      const sheet3 = result.getWorksheet('設計趨勢')
      const sheet4 = result.getWorksheet('痛點分析')
      const sheet5 = result.getWorksheet('創新機會')
      const sheet6 = result.getWorksheet('模組四')
      const sheet7 = result.getWorksheet('模組三')

      const res = {}
      const module1 = {}
      let module2 = {}
      let module3 = {}
      let module4 = {}

      if (modules.includes('module1')) {
        console.log('-----------start uploading module1-------------')
        for (let i = 0; i < 6; i += 1) {
          const key = sheet1.getCell(`A${2 + i * 3}`).value
          const tag1 = [
            sheet1.getCell(`B${2 + i * 3}`).value,
            sheet1.getCell(`C${2 + i * 3}`).value,
            sheet1.getCell(`D${2 + i * 3}`).value,
            1,
          ]
          const tag2 = [
            sheet1.getCell(`B${3 + i * 3}`).value,
            sheet1.getCell(`C${3 + i * 3}`).value,
            sheet1.getCell(`D${3 + i * 3}`).value,
            2,
          ]
          const tag3 = [
            sheet1.getCell(`B${4 + i * 3}`).value,
            sheet1.getCell(`C${4 + i * 3}`).value,
            sheet1.getCell(`D${4 + i * 3}`).value,
            3,
          ]
          module1[key] = [tag1, tag2, tag3]
        }
        res.module1 = module1
        console.log(module1)
      }

      if (modules.includes('module2')) {
        console.log('-----------start uploading module2-------------')
        const product = []
        Array.from({ length: 5 }).forEach((p, i) => {
          product.push([
            sheet2.getCell(`A${i * 3 + 2}`).value,
            [
              sheet2.getCell(`B${i * 3 + 2}`).value,
              sheet2.getCell(`B${i * 3 + 3}`).value,
              sheet2.getCell(`B${i * 3 + 4}`).value,
            ],
            [
              sheet2.getCell(`C${i * 3 + 2}`).value,
              sheet2.getCell(`C${i * 3 + 3}`).value,
              sheet2.getCell(`C${i * 3 + 4}`).value,
            ],
            sheet2.getCell(`D${i * 3 + 2}`).value,
            sheet2.getCell(`E${i * 3 + 2}`).value,
            sheet2.getCell(`F${i * 3 + 2}`).value,
          ])
        })

        const design = []
        let row = 1
        while (sheet3.getCell(`A${row}`).value) {
          design.push([
            sheet3.getCell(`A${row}`).value,
            sheet3.getCell(`B${row}`).value,
            row,
          ])
          row += 1
        }

        const weak = []
        row = 1
        while (sheet4.getCell(`A${row}`).value) {
          weak.push([
            sheet4.getCell(`A${row}`).value,
            sheet4.getCell(`B${row}`).value,
            row,
          ])
          row += 1
        }

        const inovation = {
          產品創新: [],
          服務創新: [],
          商業模式: [],
          環境建設: [],
        }
        Object.keys(inovation).forEach((key, i) => {
          Array.from({ length: 3 }).forEach((a, j) => {
            inovation[key].push([
              sheet5.getCell(`A${i * 5 + j + 3}`).value,
              sheet5.getCell(`B${i * 5 + j + 3}`).value,
              sheet5.getCell(`C${i * 5 + j + 3}`).value,
              sheet5.getCell(`D${i * 5 + j + 3}`).value,
              sheet5.getCell(`E${i * 5 + j + 3}`).value,
            ])
          })
        })
        module2 = {
          product,
          design,
          weak,
          inovation,
        }
        res.module2 = module2
      }

      if (modules.includes('module3')) {
        console.log('-----------start uploading module3-------------')
        const pics = [
          sheet6.getCell(`A1`).value || '',
          sheet6.getCell(`B1`).value || '',
          sheet6.getCell(`A2`).value || '',
          sheet6.getCell(`B2`).value || '',
        ]
        const persona = []
        let row = 2
        while (sheet6.getCell(`A${row + 1}`).value) {
          persona.push(sheet6.getCell(`A${row + 1}`).value)
          row += 1
        }
        module3 = {
          pics,
          persona,
        }
        res.module3 = module3
      }

      if (modules.includes('module4')) {
        console.log('-----------start uploading module4-------------')
        const pics = [sheet7.getCell(`A1`).value]
        const storys = [sheet7.getCell(`A3`).value]
        const events = [
          sheet7.getCell('A5').value,
          sheet7.getCell('B5').value,
          sheet7.getCell('C5').value,
          sheet7.getCell('D5').value,
          sheet7.getCell('E5').value,
        ]

        const contacts = [
          sheet7.getCell('A6').value,
          sheet7.getCell('B6').value,
          sheet7.getCell('C6').value,
          sheet7.getCell('D6').value,
          sheet7.getCell('E6').value,
        ]

        const ows = [
          sheet7.getCell('A7').value,
          sheet7.getCell('B7').value,
          sheet7.getCell('C7').value,
          sheet7.getCell('D7').value,
          sheet7.getCell('E7').value,
        ]

        module4 = {
          pics,
          storys,
          events,
          contacts,
          ows,
        }
        res.module4 = module4
      }

      callback(res)
    })
  }
  reader.readAsArrayBuffer(file)
}

export default {
  makeFile,
  readFile,
}
