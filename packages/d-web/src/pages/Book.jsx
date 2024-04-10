import React, { useEffect, useState } from 'react'
// import { ButtonGroup, Button } from 'react-bootstrap'
import { Image, Row } from 'react-bootstrap'
// import { DraftContext } from '../components/ContextProvider'
import { useParams } from 'react-router-dom'
import { logoFull } from '../asset'
import apiServices from '../services/apiServices'
// import { SuggestForm, SuggestCard, Loading } from '../components'

function Book() {
  const { article_id } = useParams()
  const [datas, setdatas] = useState({
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
  })
  const getArticle = async () => {
    const res = await apiServices.data({
      path: `article/${article_id}`,
      method: 'get',
    })
    setdatas(res.setting)
  }
  useEffect(() => {
    if (article_id) getArticle()
  }, [article_id])

  return (
    <div className="w-100 h-100 d-flex flex-column overflow-scroll">
      <Row style={{ zIndex: '2' }} className="py-4">
        <h3>{datas.title}</h3>
      </Row>
      <Row style={{ zIndex: '1' }} className="mx-auto">
        <Image
          className="position-absolute h-80 mx-auto"
          style={{ opacity: '.15', width: 'auto', left: '20%' }}
          src={logoFull}
        />
      </Row>
      <Row style={{ zIndex: '2' }} className="text-start px-4">
        {datas.Article.Text}
      </Row>
    </div>
  )
}

export default Book
