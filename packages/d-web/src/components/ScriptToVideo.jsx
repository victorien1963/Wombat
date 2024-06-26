/* eslint-disable no-nested-ternary */
/* eslint-disable no-promise-executor-return */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form, Spinner, Image, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
// import { useNavigate } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
// import { logoFull } from '../asset'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import apiServices from '../services/apiServices'
import { logoFull } from '../asset'
import Generated from '../asset/Generated.mp4'
import LoadingButton from './LoadingButton'
// import { AuthContext } from './ContextProvider'

function ScriptToVideo({ setting }) {
  //   const { auth } = useContext(AuthContext)
  //   const navigate = useNavigate()
  const { show, handleClose, handleBack, article_id } = setting

  const initDatas = {
    topic: '',
    category: '',
    language: 'English',
    links: [],
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
    Script: '',
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
  }
  const [datas, setdatas] = useState(initDatas)

  const [loading, setloading] = useState({
    Script: false,
    Video: 0,
  })

  const handlePtS = async () => {
    const res = await apiServices.data({
      path: `article/rss/${article_id}`,
      method: 'put',
      data: {
        datas,
        action: 'script',
      },
    })
    console.log(res)
    setdatas({
      ...datas,
      ...res.setting,
    })
    setloading({
      ...loading,
      Script: false,
    })
  }

  const getArticle = async () => {
    const res = await apiServices.data({
      path: `/article/${article_id}`,
      method: 'get',
    })
    setdatas({
      ...datas,
      ...res.setting,
    })
    setloading({
      ...loading,
      Script: true,
    })
    handlePtS()
  }
  useEffect(() => {
    if (article_id && show) getArticle()
    if (!show) {
      setdatas(initDatas)
      setloading({
        Script: false,
        Video: 0,
      })
    }
  }, [article_id, show])

  const handleDataChange = (key, value) =>
    setdatas({
      ...datas,
      [key]: value,
    })
  console.log(datas)

  const handleStV = async () => {
    setloading({
      ...loading,
      Video: 1,
    })
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(5000)
    setloading({
      ...loading,
      Video: 2,
    })
  }

  const [btnText, setbtnText] = useState('Upload to Youtube')
  const reUpload = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(5000)
    setbtnText('Upload to Youtube')
  }
  useEffect(() => {
    if (btnText !== 'Upload to Youtube') reUpload()
  }, [btnText])

  const handleDownload = async () => {
    // const url = URL.createObjectURL(Tim)
    // const file = new File([blob], video.name)
    const link = document.createElement('a')
    link.setAttribute('href', Generated)
    link.setAttribute('download', 'Generated.mp4')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Modal
      style={{ zIndex: '1501', width: '100vw', height: '100vh' }}
      size="xl"
      show={show !== false}
      onHide={() => handleClose(false)}
    >
      <Modal.Header
        className="justify-content-center text-center pt-4 mb-0 pb-0"
        closeButton
      >
        <Modal.Title className="w-100 my-0 py-0">
          <Row className="pb-0 w-100 my-0">
            <Col xs={12} className="text-start">
              <h4>Script To Video</h4>
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-flex AccformCard w-100"
        style={{
          height: '80vh',
        }}
      >
        <Row style={{ zIndex: '1' }} className="position-absolute w-100 d-flex">
          <Image
            className="position-absolute w-50 mx-auto"
            style={{ opacity: '.15', left: '25%', userSelect: 'none' }}
            src={logoFull}
          />
        </Row>
        <Row className="w-100">
          <Col xs={6} className="d-flex h-100">
            <div className="h-100 w-100 d-flex flex-column">
              <Form.Label className="w-100 d-flex">
                <Col xs={8} className="my-auto">
                  <h5 className="text-grey">Script</h5>
                </Col>
                <Col xs={4} className="d-flex m-auto">
                  <Button
                    size="sm"
                    variant="outline-wom ms-auto"
                    id="button-addon2"
                    title="Generate Article"
                    onClick={() => {
                      setloading({
                        ...loading,
                        Script: true,
                      })
                      handlePtS()
                    }}
                  >
                    Regenerate Script
                  </Button>
                </Col>
              </Form.Label>
              <Row className="px-3" style={{ zIndex: '2', height: '60vh' }}>
                {loading.Script ? (
                  <div className="h-100 w-100 d-flex justify-content-center border rounded">
                    <Spinner size="sm" className="my-auto" />
                    <span className="my-auto">&ensp;資料載入中</span>
                  </div>
                ) : (
                  <Form.Control
                    className="border-0"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    as="textarea"
                    rows="19"
                    value={datas.Script || ''}
                    onChange={(e) => handleDataChange('Script', e.target.value)}
                  />
                )}
              </Row>
              <Row className="px-3 d-flex flex-column">
                <div className="d-flex w-100 mt-2 px-0">
                  <Col xs={3} className="d-flex">
                    <Button
                      className="d-flex w-100 justify-content-center"
                      variant="secondary"
                      onClick={() => {
                        handleBack()
                        // saveDatas()
                        // if (step.now) {
                        //   setstep({
                        //     now: step.now,
                        //   })
                        // }
                      }}
                      // disabled={!steps[step.now]}
                    >
                      Previous Step
                    </Button>
                  </Col>
                  <Col xs={3} className="ms-3 d-flex ms-auto">
                    <Button
                      className="d-flex w-100 justify-content-center"
                      variant="dark"
                      onClick={() => {
                        handleStV()
                        // saveDatas()
                        // if (step.now) {
                        //   setstep({
                        //     now: step.now,
                        //   })
                        // }
                      }}
                      // disabled={!steps[step.now]}
                    >
                      Next Step
                    </Button>
                  </Col>
                </div>
              </Row>
            </div>
          </Col>
          <Col xs={6} className="d-flex h-100">
            <div className="h-100 w-100 d-flex flex-column">
              <Form.Label>
                <h5 className="text-grey">Video</h5>
              </Form.Label>
              {/* <Row style={{ zIndex: '1' }} className="w-100 d-flex">
                <Image
                  className="position-absolute w-50 mx-auto"
                  style={{ opacity: '.15' }}
                  src={logoFull}
                />
              </Row> */}
              <Row
                className="pt-1 pb-3 border rounded"
                style={{ zIndex: '2', height: '60vh' }}
              >
                {loading.Video === 1 ? (
                  <div className="h-100 w-100 d-flex justify-content-center">
                    <Spinner size="sm" className="my-auto" />
                    <span className="my-auto">&ensp;資料載入中</span>
                  </div>
                ) : loading.Video === 2 ? (
                  <video
                    className="my-auto"
                    width="100%"
                    height="auto"
                    controls
                  >
                    <track kind="captions" />
                    <source src={Generated} />
                  </video>
                ) : (
                  <div />
                )}
              </Row>
              <Row className="ps-3 d-flex flex-column">
                <div className="d-flex w-100 mt-2 px-0">
                  <LoadingButton
                    variant="outline-danger ms-auto"
                    id="button-addon2"
                    title="Upload to Youtube"
                    onClick={async () => {
                      const delay = (ms) =>
                        new Promise((resolve) => setTimeout(resolve, ms))
                      await delay(5000)
                      setbtnText(
                        <div>
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="my-auto fs-7 me-2"
                          />
                          Upload Success!
                        </div>
                      )
                    }}
                    btnText={btnText}
                    disabled={loading.Video !== 2}
                  />
                  <Col xs={3} className="ms-3 d-flex pe-0">
                    <Button
                      className="d-flex w-100 justify-content-center"
                      variant="wom"
                      onClick={handleDownload}
                      disabled={loading.Video !== 2}
                    >
                      Download
                    </Button>
                  </Col>
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

ScriptToVideo.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default ScriptToVideo
