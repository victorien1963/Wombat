/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import {
  Modal,
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  Form,
  Button,
  Image,
  Spinner,
  Tabs,
  Tab,
  InputGroup,
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleMinus,
  faCirclePlus,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { logoFull } from '../asset'
import apiServices from '../services/apiServices'
// import { AuthContext } from './ContextProvider'

const categories = [
  '所有類型',
  '奇幻',
  '科幻',
  '科普',
  '喜劇',
  '愛情',
  '寵物',
  '醫療',
  '未來',
]

const grid = 0
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  cursor: isDragging ? 'grab' : 'pointer',
  width: isDragging ? '50%' : '100%',
  ...draggableStyle,
})

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'transparent' : 'transparent',
  padding: grid,
  width: '100%',
})

function RSS({ setting }) {
  const {
    loading,
    setloading,
    datas,
    setdatas,
    handleDataChange,
    article_id,
    // setstep,
    handleStV,
  } = setting
  const [tempText, settempText] = useState('')
  const [tempTitleText, settempTitleText] = useState('')
  const [tempHeadText, settempHeadText] = useState('')
  const [tempLinkText, settempLinkText] = useState('')

  useEffect(() => {
    handleDataChange(
      'prompt',
      `You are a scriptwriter. Please write a script based on the theme of '${
        datas.title
      }' with ${datas.heading
        .map((h) => `[${h}]`)
        .join()} as the outline. at least 200 words each part, The script should be in ${
        datas.language
      } and suitable for use on the TextToVideo platform to generate a video.`
    )
  }, [datas.heading, datas.title])

  useEffect(() => {
    if (datas.title) settempTitleText(datas.title)
  }, [datas.title])

  return (
    <Row className="w-100 position-relative">
      {loading && (
        <div
          className="position-absolute w-100 h-100 d-flex"
          style={{
            backgroundColor: '#fff',
            opacity: '0.8',
            zIndex: '9999',
          }}
        >
          <div className="h-100 w-100 d-flex justify-content-center">
            <Spinner size="sm" className="my-auto" />
            <span className="my-auto">&ensp;Generating...</span>
          </div>
        </div>
      )}
      <Col className="overflow-scroll h-100" xs={5}>
        <Row className="d-flex flex-column p-3 pb-1">
          <Form.Label className="d-flex mb-0 w-100 px-1">
            <Col xs={10}>Topic／link</Col>
            <Col
              className="d-flex mt-auto ms-auto px-0"
              title="If you are not satisfied with the result, you can click the Generate button again or go back to the previous step to generate again."
              style={{ cursor: 'help' }}
            >
              <FontAwesomeIcon
                className="mb-auto pb-1 text-dark ms-auto pe-1"
                icon={faCircleQuestion}
              />
            </Col>
          </Form.Label>
          <ListGroup className="w-100 stepList pe-0">
            <ListGroupItem className="rounded-radius d-flex my-1 py-1 px-1 border rounded-top rounded-bottom">
              <Form.Control
                size="sm"
                className="my-auto border-0"
                placeholder="add link..."
                value={tempText}
                onChange={(e) => settempText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  handleDataChange('links', [
                    { link: tempText },
                    ...datas.links,
                  ])
                  settempText('')
                }}
                icon={faCirclePlus}
                className="my-auto mx-3 text-lightgreen"
                style={{
                  cursor: 'pointer',
                }}
                title="add link"
              />
            </ListGroupItem>
            {datas.links.map(({ link }, i) => (
              <ListGroupItem
                key={i}
                className="rounded-radius d-flex my-1 py-1 px-1 border rounded-top rounded-bottom"
              >
                <Form.Control
                  size="sm"
                  className="my-auto border-0"
                  placeholder="add link..."
                  value={link}
                  onChange={(e) => {
                    handleDataChange(
                      'links',
                      datas.links.map((l, index) =>
                        index === i
                          ? {
                              link: e.target.value,
                            }
                          : l
                      )
                    )
                  }}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    handleDataChange(
                      'links',
                      datas.links.filter((l, index) => index !== i)
                    )
                  }}
                  icon={faCircleMinus}
                  className="my-auto mx-3 text-lightred"
                  title="remove"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>
        <Row className="p-3 pb-1 d-flex">
          <Col xs={6} className="px-0">
            <Form.Label className="px-1 mb-0">Language</Form.Label>
            <Form.Select
              value={datas.language}
              onChange={(e) => handleDataChange('language', e.target.value)}
            >
              <option value="">Select a language</option>
              {['English', '中文'].map((l) => (
                <option value={l} key={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={6} className="px-0 ps-1">
            <Form.Label className="px-1 mb-0">Category</Form.Label>
            <Form.Select
              value={datas.category}
              onChange={(e) => handleDataChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row
          className="p-3 d-flex flex-column"
          style={{
            height: '61%',
          }}
        >
          {/* <Form.Label className="mb-0 px-1">Prompt</Form.Label>
          <Form.Control
            className="flex-fill"
            as="textarea"
            rows={10}
            // value={datas.prompt}
            value={`You are a scriptwriter. Please write a script based on the theme of '${
              datas.title
            }' with ${datas.heading
              .map((h) => `[${h}]`)
              .join()} as the outline. The script should be in ${
              datas.language
            } and suitable for use on the TextToVideo platform to generate a video.`}
            onChange={(e) => handleDataChange('prompt', e.target.value)}
            placeholder="Start by entering your prompt to generate article..."
          /> */}
          <div className="d-flex w-100 mt-auto px-0">
            {datas.links.length ? (
              <Button
                variant="wom ms-auto"
                id="button-addon2"
                title="Generate Article"
                onClick={async () => {
                  setloading(true)
                  const res = await apiServices.data({
                    path: `article/rss/${article_id}`,
                    method: 'put',
                    data: {
                      datas,
                      action: 'title',
                    },
                  })
                  setloading(false)
                  setdatas(res.setting)
                  // setstep({
                  //   now: 6,
                  //   max: 6,
                  // })
                }}
              >
                Generate
              </Button>
            ) : (
              <Button
                variant="wom ms-auto"
                id="button-addon2"
                title="Generate Article"
                disabled
              >
                Generate
              </Button>
            )}
          </div>
        </Row>
      </Col>
      <Col xs={7} className="d-flex h-100">
        <div className="h-100 w-100 d-flex flex-column">
          {datas.title && (
            <Row style={{ zIndex: '2' }} className="mb-3">
              <InputGroup className="px-0 py-1 searchBar">
                <Form.Label className="h-100 px-3 d-flex mb-0">
                  <h5 className="my-auto text-grey">Title</h5>
                </Form.Label>
                <Form.Control
                  value={tempTitleText}
                  onChange={(e) => settempTitleText(e.target.value)}
                  placeholder="Enter Title..."
                />
                <Button
                  variant="wom"
                  id="button-addon2"
                  title="generate"
                  onClick={async () => {
                    setloading(true)
                    handleDataChange('title', tempTitleText)
                    const res = await apiServices.data({
                      path: `article/rss/${article_id}`,
                      method: 'put',
                      data: {
                        datas: {
                          ...datas,
                          title: tempTitleText,
                        },
                        action: 'rss',
                      },
                    })
                    setloading(false)
                    setdatas(res.setting)
                  }}
                >
                  Generate Headings
                </Button>
              </InputGroup>
            </Row>
          )}
          <Row style={{ zIndex: '0' }} className="w-100 d-flex">
            <Image
              className="position-absolute w-50 mx-auto"
              style={{ opacity: '.15' }}
              src={logoFull}
            />
          </Row>
          {datas.title && (
            <>
              <Form.Label className="p-2 mb-0 h5 text-grey">
                Headings
              </Form.Label>
              <Row
                className="ps-3 d-flex flex-column"
                style={{
                  height: '55vh',
                  zIndex: '2',
                }}
              >
                <ListGroup
                  className="h-100 w-100 stepList overflow-scroll pe-0"
                  title="上下拖曳以排序"
                >
                  <ListGroupItem className="rounded-radius d-flex my-1 border rounded-top rounded-bottom">
                    <Form.Control
                      size="sm"
                      className="my-auto border-0"
                      placeholder="Add Your Own Heading"
                      value={tempHeadText}
                      onChange={(e) => settempHeadText(e.target.value)}
                    />
                    <Form.Control
                      size="sm"
                      className="my-auto border-0"
                      placeholder="Add Reference Link"
                      value={tempLinkText}
                      onChange={(e) => settempLinkText(e.target.value)}
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        handleDataChange('heading', [
                          `${tempHeadText}_${tempLinkText}`,
                          ...datas.heading,
                        ])
                        settempHeadText('')
                      }}
                      icon={faCirclePlus}
                      className="my-auto mx-3 text-lightgreen"
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </ListGroupItem>
                  <DragDropContext
                    onDragEnd={(e) => {
                      if (!e.destination) return
                      const result = Array.from(datas.heading)
                      const [removed] = result.splice(e.source.index, 1)
                      result.splice(e.destination.index, 0, removed)
                      handleDataChange('heading', result)
                    }}
                  >
                    <Droppable
                      className="w-100"
                      droppableId="droppable"
                      direction="vertical"
                    >
                      {(dropProvided, dropSnapshot) => (
                        <div
                          {...dropProvided.droppableProps}
                          ref={dropProvided.innerRef}
                          style={getListStyle(dropSnapshot.isDraggingOver)}
                          className="w-100 h-100 d-flex flex-column overflow-scroll"
                        >
                          {datas.heading.map((label, i) => (
                            <Draggable
                              className="w-100"
                              key={`${i}`}
                              draggableId={`${label}`}
                              index={i}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  className="d-flex rounded-radius my-1 border rounded-top rounded-bottom px-3"
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...getItemStyle(
                                      dragSnapshot.isDragging,
                                      dragProvided.draggableProps.style
                                    ),
                                    height: '50px',
                                    maxHeight: '50px',
                                    minHeight: '50px',
                                    // minWidth: '32%',
                                    // height: '40vh',
                                  }}
                                >
                                  {/* <ListGroupItem
                              key={i}
                              action
                              className="h-100 rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                              style={{
                                pointerEvents: 'none',
                              }}
                            > */}
                                  <Form.Control
                                    className="my-auto border-0"
                                    style={{
                                      backgroundColor: 'transparent',
                                    }}
                                    value={label.split('_')[0]}
                                    onChange={(e) => {
                                      handleDataChange(
                                        'heading',
                                        datas.heading.map((h, j) =>
                                          j === i
                                            ? `${e.target.value}_${
                                                h.split('_')[1] || ''
                                              }`
                                            : h
                                        )
                                      )
                                    }}
                                  />
                                  <Form.Control
                                    className="my-auto border-0"
                                    style={{
                                      backgroundColor: 'transparent',
                                    }}
                                    placeholder="Add Reference Link"
                                    value={label.split('_')[1]}
                                    onChange={(e) => {
                                      handleDataChange(
                                        'heading',
                                        datas.heading.map((h, j) =>
                                          j === i
                                            ? `${h.split('_')[0] || ''}_${
                                                e.target.value
                                              }`
                                            : h
                                        )
                                      )
                                    }}
                                  />
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      handleDataChange(
                                        'heading',
                                        datas.heading.filter((h, j) => i !== j)
                                      )
                                      settempHeadText('')
                                    }}
                                    icon={faCircleMinus}
                                    className="my-auto mx-3 text-lightred"
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                  />
                                  {/* </ListGroupItem> */}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </ListGroup>
              </Row>
              <Row>
                <Col className="ms-3 d-flex justify-content-end">
                  <Button
                    className="d-flex w-25 justify-content-center"
                    variant="dark"
                    onClick={() => {
                      handleStV()
                    }}
                    disabled={!datas.title || !datas.heading.length}
                  >
                    Next step
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Col>
    </Row>
  )
}

function Speed({ setting }) {
  const {
    loading,
    setloading,
    datas,
    setdatas,
    handleDataChange,
    article_id,
    step,
    steps,
    setstep,
    copyTarget,
    handleCopy,
    saveDatas,
  } = setting
  return (
    <Row className="w-100 position-relative">
      {loading && (
        <div
          className="position-absolute w-100 h-100 d-flex"
          style={{
            backgroundColor: '#fff',
            opacity: '0.8',
            zIndex: '9999',
          }}
        >
          <div className="h-100 w-100 d-flex justify-content-center">
            <Spinner size="sm" className="my-auto" />
            <span className="my-auto">&ensp;Generating...</span>
          </div>
        </div>
      )}
      <Col xs={5}>
        <Row className="p-3">
          <Form.Label className="d-flex row mb-0 pe-0">
            <Col xs={10} className="px-0">
              Topic
            </Col>
            <Col
              className="d-flex mt-auto ms-auto px-0"
              title="If you are not satisfied with the result, you can click the Generate button again or go back to the previous step to generate again."
              style={{ cursor: 'help' }}
            >
              <FontAwesomeIcon
                className="mb-auto pb-1 text-dark ms-auto pe-1"
                icon={faCircleQuestion}
              />
            </Col>
          </Form.Label>
          <InputGroup className="px-0 py-1 searchBar">
            <Form.Control
              value={datas.topic}
              onChange={(e) => handleDataChange('topic', e.target.value)}
              placeholder="Describe the script you want to generate..."
            />
            <Button
              variant="outline-wom"
              id="button-addon2"
              title="搜 尋"
              onClick={async () => {
                setloading(true)
                const res = await apiServices.data({
                  path: `article/simple/${article_id}`,
                  method: 'put',
                  data: {
                    datas,
                    action: 'prompt',
                  },
                })
                setloading(false)
                setdatas(res.setting)
                setstep({
                  now: 5,
                  max: 5,
                })
              }}
            >
              Generate
            </Button>
          </InputGroup>
        </Row>
        <Row className="px-3 d-flex w-100">
          <Col xs={6} className="px-0 my-auto">
            <Form.Label className="px-1 mb-0">Language</Form.Label>
            <Form.Select
              value={datas.language}
              onChange={(e) => handleDataChange('language', e.target.value)}
            >
              <option value="">Select a language</option>
              {['English', '中文'].map((l) => (
                <option value={l} key={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={6} className="px-0">
            <Form.Label className="px-1 mb-0">Category</Form.Label>
            <Form.Select
              value={datas.category}
              onChange={(e) => handleDataChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Row
          className="p-3 d-flex flex-column"
          style={{
            height: '61%',
          }}
        >
          <Form.Label className="mb-0">Prompt</Form.Label>
          <Form.Control
            className="flex-fill"
            as="textarea"
            rows={10}
            value={datas.prompt}
            onChange={(e) => handleDataChange('prompt', e.target.value)}
            placeholder="Start by entering your prompt to generate article..."
          />
          <div className="d-flex w-100 mt-2 px-0">
            {copyTarget && (
              <Button
                variant="outline-wom"
                className="d-flex my-auto ms-auto"
                title="Apply & copy this template to your project."
                onClick={handleCopy}
              >
                Apply this template
              </Button>
            )}
            <Button
              variant="outline-wom ms-auto"
              id="button-addon2"
              title="Generate Article"
              onClick={async () => {
                setloading(true)
                const res = await apiServices.data({
                  path: `article/simple/${article_id}`,
                  method: 'put',
                  data: {
                    datas,
                    action: 'article',
                  },
                })
                setloading(false)
                setdatas(res.setting)
                setstep({
                  now: 6,
                  max: 6,
                })
              }}
            >
              Generate Article
            </Button>
            <Col xs={2} className="ms-3 d-flex">
              <Button
                className="d-flex w-100 justify-content-center"
                variant="wom"
                onClick={() => {
                  saveDatas()
                  if (step.now) {
                    setstep({
                      now: step.now,
                    })
                  }
                }}
                disabled={!steps[step.now]}
              >
                Save
              </Button>
            </Col>
          </div>
        </Row>
      </Col>
      <Col xs={7} className="d-flex h-100">
        <div className="h-100 w-100 d-flex flex-column">
          <Row style={{ zIndex: '2' }} className="mb-3">
            <Form.Control
              className="fw-bold p-0 ps-2 border-0 fs-3"
              value={datas.title}
              onChange={(e) => {
                handleDataChange('title', e.target.value)
              }}
            />
          </Row>
          <Row style={{ zIndex: '0' }} className="w-100 d-flex">
            <Image
              className="position-absolute w-50 mx-auto"
              style={{ opacity: '.15' }}
              src={logoFull}
            />
          </Row>
          <Row className="pt-1 pb-3" style={{ zIndex: '2' }}>
            <Form.Control
              className="border-0"
              style={{
                backgroundColor: 'transparent',
              }}
              as="textarea"
              rows="19"
              value={datas.Article.Text}
              onChange={(e) =>
                handleDataChange('Article', {
                  ...datas.Article,
                  Text: e.target.value,
                })
              }
            />
          </Row>
        </div>
      </Col>
    </Row>
  )
}

function Regular({ setting }) {
  const { loading, step, steps, setstep, nextStep, copyTarget, handleCopy } =
    setting

  return (
    <Row className="w-100">
      <Col xs={3}>
        <ListGroup className="h-90 w-100 rounded-radius stepList">
          {steps.map(({ title }, index) => (
            <ListGroupItem
              key={index}
              action
              active={index === step.now}
              disabled={index > step.max}
              onClick={() =>
                setstep({
                  ...step,
                  now: index,
                })
              }
            >
              •&ensp;{title}
            </ListGroupItem>
          ))}
        </ListGroup>
        {copyTarget && (
          <Button
            variant="outline-wom"
            className="d-flex w-100 justify-content-center my-auto"
            title="Apply & copy this template to your project."
            onClick={handleCopy}
          >
            Apply this template
          </Button>
        )}
      </Col>
      <Col xs={9} className="d-flex h-100">
        <div className="my-auto w-100 h-100 pt-3">
          <Row
            className="overflow-scroll"
            style={{
              height: '90%',
              maxHeight: '90%',
            }}
          >
            {loading ? (
              <div className="h-100 w-100 d-flex justify-content-center">
                <Spinner size="sm" className="my-auto" />
                <span className="my-auto">&ensp;Generating...</span>
              </div>
            ) : (
              steps[step.now].form
            )}
          </Row>
          <Row>
            {step.now ? (
              <>
                <Col xs={2} className="ms-auto d-flex">
                  <Button
                    className="d-flex w-100 justify-content-center"
                    variant="secondary"
                    onClick={() => {
                      setstep({
                        now: step.now - 1,
                        max: step.max,
                      })
                    }}
                  >
                    Back
                  </Button>
                </Col>
                <Col xs={2} className="ms-auto d-flex">
                  <Button
                    className="d-flex w-100 justify-content-center"
                    variant="secondary"
                    onClick={() => {
                      setstep({
                        now: step.now - 1,
                        max: step.max,
                      })
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </>
            ) : (
              <Col className="ms-auto" />
            )}
            <Col xs={2} className="ms-0 d-flex">
              <Button
                className="d-flex w-100 justify-content-center"
                variant="wom"
                onClick={() => {
                  nextStep()
                  if (step.now !== 6) {
                    setstep({
                      now: step.now + 1,
                      max: Math.max(step.now + 1, step.max),
                    })
                  }
                }}
                disabled={!steps[step.now].complete}
              >
                {step.now === 6 ? 'Save' : 'Continue'}
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

function SettingModal({ setting }) {
  //   const { auth } = useContext(AuthContext)
  const navigate = useNavigate()
  const { show, handleClose, copyTarget, handleCopy, article_id } = setting

  const [mode, setmode] = useState(0)

  const [datas, setdatas] = useState({
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

  const initStep = {
    now: 0,
    max: 0,
  }
  const [step, setstep] = useState(initStep)

  const getArticle = async () => {
    const res = await apiServices.data({
      path: `/article/${article_id}`,
      method: 'get',
    })
    setdatas({
      ...datas,
      ...res.setting,
    })
    setstep(res.setting.step || initStep)
  }
  useEffect(() => {
    if (article_id) getArticle()
  }, [article_id])

  const saveArticle = async () => {
    console.log('---realtime saving---')
    await apiServices.data({
      path: `/article/save/${article_id}`,
      method: 'put',
      data: {
        ...datas,
        StV: false,
      },
    })
    console.log('---realtime saving completed---')
  }
  useEffect(() => {
    if (article_id && show) saveArticle()
  }, [datas, article_id, show])

  const handleDataChange = (key, value) =>
    setdatas({
      ...datas,
      [key]: value,
    })

  const [tempText, settempText] = useState('')

  const steps = [
    {
      title: 'Enter a Topic',
      form: (
        <>
          <Row
            style={{
              height: '5%',
            }}
          >
            <h3>Start Your Article: Choose Your Topic</h3>
          </Row>
          <Row
            style={{
              height: '5%',
            }}
          >
            <h6>
              Define the key elements to tailor your content for targeted
              impact.
            </h6>
          </Row>
          <Row
            style={{
              height: '15%',
            }}
          >
            <Form.Label className="d-flex row">
              <Col xs={11}>Topic</Col>
              <Col
                xs={1}
                className="d-flex mt-auto ms-auto px-0"
                title="If you are not satisfied with the result, you can click the Generate button again or go back to the previous step to generate again."
                style={{ cursor: 'help' }}
              >
                <FontAwesomeIcon
                  className="mb-auto pb-1 text-dark ms-auto pe-1"
                  icon={faCircleQuestion}
                />
              </Col>
            </Form.Label>
            <Form.Control
              value={datas.topic}
              onChange={(e) => handleDataChange('topic', e.target.value)}
            />
          </Row>
          <Row
            style={{
              height: '40%',
            }}
          >
            <Col xs={6}>
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={datas.language}
                onChange={(e) => handleDataChange('language', e.target.value)}
              >
                <option value="">Select a language</option>
                {['English', '中文'].map((l) => (
                  <option value={l} key={l}>
                    {l}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6}>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={datas.category}
                onChange={(e) => handleDataChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </>
      ),
      complete: datas.topic,
    },
    {
      title: 'Select Primary Keyword',
      form: (
        <>
          <Row>
            <h3>Choose Your Primary Keyword</h3>
          </Row>
          <Row>
            <h6>
              Select the most strategic keyword to anchor your content and drive
              SEO performance. You can also add your own keyword.
            </h6>
          </Row>
          <Row />
          <ListGroup className="h-100 w-100 stepList">
            <ListGroupItem
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '10%',
              }}
            >
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Keyword"
                value={tempText}
                onChange={(e) => settempText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  handleDataChange('Pkeywords', [
                    { label: tempText },
                    ...datas.Pkeywords,
                  ])
                  settempText('')
                }}
                icon={faCirclePlus}
                className="h-50 my-auto mx-3"
                style={{
                  cursor: 'pointer',
                }}
              />
            </ListGroupItem>
            {datas.Pkeywords.map(({ label }) => (
              <ListGroupItem
                key={label}
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '15%',
                }}
                onClick={() => handleDataChange('Pkeyword', [label])}
                active={datas.Pkeyword[0] === label}
              >
                <Form.Check
                  className="my-auto me-2"
                  type="radio"
                  checked={datas.Pkeyword[0] === label}
                  readOnly
                />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
      complete: datas.Pkeyword.length,
    },
    {
      title: 'Select a Title',
      form: (
        <>
          <Row>
            <h3>Choose an Engaging Title</h3>
          </Row>
          <Row>
            <h6>
              Select a title that captivates and reflects the essence of your
              article as well as your chosen primary keyword for maximum SEO
              impact. You can also use your own title.
            </h6>
          </Row>
          <Row />
          <ListGroup className="h-100 w-100 stepList">
            <ListGroupItem
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '10%',
              }}
            >
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Keyword"
                value={tempText}
                onChange={(e) => settempText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  handleDataChange('titles', [
                    { label: tempText },
                    ...datas.titles,
                  ])
                  settempText('')
                }}
                icon={faCirclePlus}
                className="h-50 my-auto mx-3"
                style={{
                  cursor: 'pointer',
                }}
              />
            </ListGroupItem>
            {datas.titles.map(({ label }) => (
              <ListGroupItem
                key={label}
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '15%',
                }}
                onClick={() => handleDataChange('title', label)}
                active={datas.title === label}
              >
                <Form.Check
                  className="my-auto me-2"
                  type="radio"
                  checked={datas.title === label}
                  readOnly
                />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
      complete: datas.title,
    },
    {
      title: 'Select Secondary Keyword',
      form: (
        <>
          <Row>
            <h3>Select Secondary Keywords</h3>
          </Row>
          <Row>
            <h6>
              Choose between 5 to 15 secondary keywords to broaden your contents
              reach and relevance.
            </h6>
          </Row>
          <Row />
          <ListGroup className="h-100 w-100 stepList">
            <ListGroupItem
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '10%',
              }}
            >
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Keyword"
                value={tempText}
                onChange={(e) => settempText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  handleDataChange('Skeywords', [
                    { label: tempText },
                    ...datas.Skeywords,
                  ])
                  settempText('')
                }}
                icon={faCirclePlus}
                className="h-50 my-auto mx-3 text-lightgreen"
                style={{
                  cursor: 'pointer',
                }}
              />
            </ListGroupItem>
            {datas.Skeywords.map(({ label }) => (
              <ListGroupItem
                key={label}
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '13%',
                }}
                onClick={() =>
                  handleDataChange(
                    'Skeyword',
                    datas.Skeyword.includes(label)
                      ? datas.Skeyword.filter((s) => s !== label)
                      : [...datas.Skeyword, label]
                  )
                }
                active={datas.Skeyword.includes(label)}
              >
                <Form.Check
                  className="my-auto me-2"
                  checked={datas.Skeyword.includes(label)}
                  readOnly
                />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
      complete: datas.Skeyword.length,
    },
    // {
    //   title: 'Additional Settings',
    //   form: <div />,
    // },
    // {
    //   title: 'Select Headings',
    //   form: (
    //     <>
    //       <Row>
    //         <h3>Select an Outline to Structure Your Content</h3>
    //       </Row>
    //       <Row>
    //         <h6>
    //           Choose an outline that best represents the structure and flow you
    //           envision for your article.
    //         </h6>
    //       </Row>
    //       <Row />
    //       <ListGroup className="h-100 w-100 stepList">
    //         <ListGroupItem
    //           action
    //           className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
    //           style={{
    //             height: '20%',
    //           }}
    //         >
    //           <Form.Check className="my-auto me-1" type="radio" />
    //           <Form.Control
    //             size="sm"
    //             className="h-75 my-auto border-0"
    //             placeholder="Add Your Own Title"
    //           />
    //         </ListGroupItem>
    //         {datas.headings.map((hs, index) => (
    //           <ListGroupItem
    //             key={index}
    //             action
    //             className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
    //             onClick={() => handleDataChange('heading', hs)}
    //             active={datas.heading.every((h, i) => hs[i] === h)}
    //           >
    //             <div className="me-2">
    //               <Form.Check
    //                 className="my-auto"
    //                 type="radio"
    //                 checked={datas.heading.every((h, i) => hs[i] === h)}
    //                 readOnly
    //               />
    //             </div>
    //             <Col>
    //               {hs.map((h, i) => (
    //                 <p key={h} className="w-100 my-0">
    //                   Section {i + 1}: {h}
    //                 </p>
    //               ))}
    //             </Col>
    //           </ListGroupItem>
    //         ))}
    //       </ListGroup>
    //     </>
    //   ),
    // },
    {
      title: 'Finalize Outline',
      form: (
        <>
          <Row>
            <h3>Arrange and Customize Your Headings</h3>
          </Row>
          <Row>
            <h6>
              Put the final touches on your articles structure. Arrange the
              headings in the order that best fits your narrative and add any
              custom sections you need.
            </h6>
          </Row>
          <Row />
          <ListGroup className="h-100 w-100 stepList" title="上下拖曳以排序">
            <ListGroupItem
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '10%',
              }}
            >
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Keyword"
                value={tempText}
                onChange={(e) => settempText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => {
                  handleDataChange('heading', [tempText, ...datas.heading])
                  settempText('')
                }}
                icon={faCirclePlus}
                className="h-50 my-auto mx-3 text-lightgreen"
                style={{
                  cursor: 'pointer',
                }}
              />
            </ListGroupItem>
            <DragDropContext
              onDragEnd={(e) => {
                if (!e.destination) return
                const result = Array.from(datas.heading)
                const [removed] = result.splice(e.source.index, 1)
                result.splice(e.destination.index, 0, removed)
                handleDataChange('heading', result)
              }}
            >
              <Droppable
                className="w-100"
                droppableId="droppable"
                direction="vertical"
              >
                {(dropProvided, dropSnapshot) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                    className="w-100 h-100 d-flex flex-column overflow-scroll"
                  >
                    {datas.heading.map((label, i) => (
                      <Draggable
                        className="w-100"
                        key={`${label}`}
                        draggableId={`${label}`}
                        index={i}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            className="d-flex rounded-radius my-1 border rounded-top rounded-bottom px-3"
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={{
                              ...getItemStyle(
                                dragSnapshot.isDragging,
                                dragProvided.draggableProps.style
                              ),
                              height: '90px',
                              maxHeight: '90px',
                              minHeight: '90px',
                              // minWidth: '32%',
                              // height: '40vh',
                            }}
                          >
                            {/* <ListGroupItem
                              key={i}
                              action
                              className="h-100 rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                              style={{
                                pointerEvents: 'none',
                              }}
                            > */}
                            <Form.Control
                              className="my-auto border-0"
                              value={label}
                              onChange={(e) => {
                                handleDataChange(
                                  'heading',
                                  datas.heading.map((h, j) =>
                                    j === i ? e.target.value : h
                                  )
                                )
                              }}
                            />
                            {/* </ListGroupItem> */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ListGroup>
        </>
      ),
      complete: true,
    },
    {
      title: 'Confirm Prompt',
      form: (
        <>
          <Row>
            <h3>Confirm and Customize Your Prompt</h3>
          </Row>
          <Row className="my-0">
            <h6>
              Put the final touches on your Prompt. Arrange the Prompt that best
              fits your narrative and add any word you need.
            </h6>
          </Row>
          <Row
            className="mx-auto"
            style={{
              height: '80%',
            }}
          >
            <Form.Control
              as="textarea"
              rows={10}
              value={datas.prompt}
              onChange={(e) => handleDataChange('prompt', e.target.value)}
            />
          </Row>
        </>
      ),
      complete: true,
    },
    {
      title: 'Generate Article',
      form: (
        <div className="h-100 w-100 d-flex flex-column">
          <Row style={{ zIndex: '2' }} className="mb-3">
            <Form.Control
              className="fw-bold p-0 ps-2 border-0 fs-3"
              value={datas.title}
              onChange={(e) => {
                handleDataChange('title', e.target.value)
              }}
            />
          </Row>
          <Row style={{ zIndex: '0' }} className="w-100 d-flex">
            <Image
              className="position-absolute w-50 mx-auto"
              style={{ opacity: '.15' }}
              src={logoFull}
            />
          </Row>
          <Row className="flex-fill py-3" style={{ zIndex: '2' }}>
            <Form.Control
              className="border-0"
              style={{
                backgroundColor: 'transparent',
              }}
              as="textarea"
              value={datas.Article.Text}
              onChange={(e) =>
                handleDataChange('Article', {
                  ...datas.Article,
                  Text: e.target.value,
                })
              }
            />
          </Row>
        </div>
      ),
      complete: true,
    },
  ]

  const [loading, setloading] = useState(false)
  const nextStep = async () => {
    setloading(true)
    if (step.now === 6) {
      const res = await apiServices.data({
        path: `article/${article_id}`,
        method: 'put',
        data: {
          datas,
          step: {
            ...step,
            now: 7,
          },
        },
      })
      setloading(false)
      setdatas(res.setting)
      navigate(`/book/${datas.project_id}/${article_id}`)
      handleClose()
    } else {
      const res = await apiServices.data({
        path: `article/${article_id}`,
        method: 'put',
        data: {
          datas,
          step: {
            now: step.now + 1,
            max: Math.max(step.now + 1, step.max),
          },
        },
      })
      setloading(false)
      setdatas(res.setting)
    }
  }

  const saveDatas = async () => {
    if (step.now === 1) {
      const res = await apiServices.data({
        path: `article/${article_id}`,
        method: 'put',
        data: {
          datas,
          step: {
            ...step,
            now: 1,
          },
        },
      })
      setdatas(res.setting)
      navigate(`/book/${datas.project_id}/${article_id}`)
      handleClose()
    } else {
      const res = await apiServices.data({
        path: `article/${article_id}`,
        method: 'put',
        data: {
          datas,
          step: {
            now: 1,
          },
        },
      })
      setdatas(res.setting)
    }
  }

  const modes = [
    <RSS
      setting={{
        loading,
        setloading,
        datas,
        setdatas,
        handleDataChange,
        article_id,
        step,
        steps,
        setstep,
        copyTarget,
        handleCopy,
        saveDatas,
        handleStV: async () => {
          // await apiServices.data({
          //   path: `article/rss/${article_id}`,
          //   method: 'put',
          //   data: {
          //     datas,
          //     action: '',
          //   },
          // })
          setting.handleStV()
        },
      }}
    />,
    <Speed
      setting={{
        loading,
        setloading,
        datas,
        setdatas,
        handleDataChange,
        article_id,
        step,
        steps,
        setstep,
        copyTarget,
        handleCopy,
        saveDatas,
      }}
    />,
    <Regular
      setting={{
        loading,
        step,
        steps,
        setstep,
        nextStep,
        copyTarget,
        handleCopy,
      }}
    />,
  ]

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
            {/* <Col xs={2}>
              <h4>新建專案</h4>
            </Col> */}
            <Col xs={8}>
              <Tabs
                defaultActiveKey={0}
                className="border-0 fs-6"
                onSelect={(k) => {
                  setmode(parseInt(k, 10))
                }}
              >
                <Tab title="Introducing Articles" eventKey={0} />
                <Tab title="Quick Generation" eventKey={1} />
                <Tab title="Detailed Settings" eventKey={2} />
              </Tabs>
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
        {modes[mode]}
        {/* {mode ? (
          <Row className="w-100">
            <Col xs={3}>
              <ListGroup className="h-90 w-100 rounded-radius stepList">
                {steps.map(({ title }, index) => (
                  <ListGroupItem
                    key={index}
                    action
                    active={index === step.now}
                    disabled={index > step.max}
                    onClick={() =>
                      setstep({
                        ...step,
                        now: index,
                      })
                    }
                  >
                    •&ensp;{title}
                  </ListGroupItem>
                ))}
              </ListGroup>
              {copyTarget && (
                <Button
                  variant="outline-wom"
                  className="d-flex w-100 justify-content-center my-auto"
                  title="Apply & copy this template to your project."
                  onClick={handleCopy}
                >
                  Apply this template
                </Button>
              )}
            </Col>
            <Col xs={9} className="d-flex h-100">
              <div className="my-auto w-100 h-100 pt-3">
                <Row
                  className="overflow-scroll"
                  style={{
                    height: '90%',
                    maxHeight: '90%',
                  }}
                >
                  {loading ? (
                    <div className="h-100 w-100 d-flex justify-content-center">
                      <Spinner size="sm" className="my-auto" />
                      <span className="my-auto">&ensp;資料載入中</span>
                    </div>
                  ) : (
                    steps[step.now].form
                  )}
                </Row>
                <Row>
                  {step.now ? (
                    <>
                      <Col xs={2} className="ms-auto d-flex">
                        <Button
                          className="d-flex w-100 justify-content-center"
                          variant="secondary"
                          onClick={() => {
                            setstep({
                              now: step.now - 1,
                              max: step.max,
                            })
                          }}
                        >
                          Back
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <Col className="ms-auto" />
                  )}
                  <Col xs={2} className="ms-0 d-flex">
                    <Button
                      className="d-flex w-100 justify-content-center"
                      variant="wom"
                      onClick={() => {
                        nextStep()
                        if (step.now !== 6) {
                          setstep({
                            now: step.now + 1,
                            max: Math.max(step.now + 1, step.max),
                          })
                        }
                      }}
                      disabled={!steps[step.now].complete}
                    >
                      {step.now === 6 ? 'Save' : 'Continue'}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        ) : (
          <Row className="w-100 position-relative">
            {loading && (
              <div
                className="position-absolute w-100 h-100 d-flex"
                style={{
                  backgroundColor: '#fff',
                  opacity: '0.8',
                  zIndex: '9999',
                }}
              >
                <div className="h-100 w-100 d-flex justify-content-center">
                  <Spinner size="sm" className="my-auto" />
                  <span className="my-auto">&ensp;資料載入中</span>
                </div>
              </div>
            )}
            <Col xs={5}>
              <Row
                className="p-3"
                style={{
                  height: '11%',
                }}
              >
                <Form.Label className="mb-0">Topic</Form.Label>
                <InputGroup className="px-0 py-1 searchBar">
                  <Form.Control
                    value={datas.topic}
                    onChange={(e) => handleDataChange('topic', e.target.value)}
                    placeholder="Describe the script you want to generate..."
                  />
                  <Button
                    variant="outline-wom"
                    id="button-addon2"
                    title="搜 尋"
                    onClick={async () => {
                      setloading(true)
                      const res = await apiServices.data({
                        path: `article/simple/${article_id}`,
                        method: 'put',
                        data: {
                          datas,
                          action: 'prompt',
                        },
                      })
                      setloading(false)
                      setdatas(res.setting)
                      setstep({
                        now: 5,
                        max: 5,
                      })
                    }}
                  >
                    Generate
                  </Button>
                </InputGroup>
              </Row>
              <Row
                className="p-3 d-flex flex-column"
                style={{
                  height: '11%',
                }}
              >
                <Col xs={12} className="px-0">
                  <Form.Label className="px-2 mb-0">Language</Form.Label>
                  <Form.Select
                    value={datas.language}
                    onChange={(e) =>
                      handleDataChange('language', e.target.value)
                    }
                  >
                    <option value="">Select a language</option>
                    {['English', '中文'].map((l) => (
                      <option value={l}>{l}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row
                className="p-3 d-flex flex-column"
                style={{
                  height: '11%',
                }}
              >
                <Col xs={12} className="px-0">
                  <Form.Label className="px-2 mb-0">Category</Form.Label>
                  <Form.Select
                    value={datas.category}
                    onChange={(e) =>
                      handleDataChange('category', e.target.value)
                    }
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row
                className="p-3 d-flex flex-column"
                style={{
                  height: '61%',
                }}
              >
                <Form.Label className="mb-0">Prompt</Form.Label>
                <Form.Control
                  className="flex-fill"
                  as="textarea"
                  rows={10}
                  value={datas.prompt}
                  onChange={(e) => handleDataChange('prompt', e.target.value)}
                  placeholder="Start by entering your prompt to generate article..."
                />
                <div className="d-flex w-100 mt-2 px-0">
                  {copyTarget && (
                    <Button
                      variant="outline-wom"
                      className="d-flex my-auto ms-auto"
                      title="Apply & copy this template to your project."
                      onClick={handleCopy}
                    >
                      Apply this template
                    </Button>
                  )}
                  <Button
                    variant="outline-wom ms-auto"
                    id="button-addon2"
                    title="Generate Article"
                    onClick={async () => {
                      setloading(true)
                      const res = await apiServices.data({
                        path: `article/simple/${article_id}`,
                        method: 'put',
                        data: {
                          datas,
                          action: 'article',
                        },
                      })
                      setloading(false)
                      setdatas(res.setting)
                      setstep({
                        now: 6,
                        max: 6,
                      })
                    }}
                  >
                    Generate Article
                  </Button>
                  <Col xs={2} className="ms-3 d-flex">
                    <Button
                      className="d-flex w-100 justify-content-center"
                      variant="wom"
                      onClick={() => {
                        saveDatas()
                        if (step.now) {
                          setstep({
                            now: step.now,
                          })
                        }
                      }}
                      disabled={!steps[step.now]}
                    >
                      Save
                    </Button>
                  </Col>
                </div>
              </Row>
            </Col>
            <Col xs={7} className="d-flex h-100">
              <div className="h-100 w-100 d-flex flex-column">
                <Row style={{ zIndex: '2' }} className="mb-3">
                  <Form.Control
                    className="fw-bold p-0 ps-2 border-0 fs-3"
                    value={datas.title}
                    onChange={(e) => {
                      handleDataChange('title', e.target.value)
                    }}
                  />
                </Row>
                <Row style={{ zIndex: '1' }} className="w-100 d-flex">
                  <Image
                    className="position-absolute w-50 mx-auto"
                    style={{ opacity: '.15' }}
                    src={logoFull}
                  />
                </Row>
                <Row className="pt-1 pb-3" style={{ zIndex: '2' }}>
                  <Form.Control
                    className="border-0"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    as="textarea"
                    rows="19"
                    value={datas.Article.Text}
                    onChange={(e) =>
                      handleDataChange('Article', {
                        ...datas.Article,
                        Text: e.target.value,
                      })
                    }
                  />
                </Row>
              </div>
            </Col>
          </Row>
        )} */}
      </Modal.Body>
    </Modal>
  )
}

SettingModal.propTypes = {
  setting: PropTypes.shape().isRequired,
}

RSS.propTypes = {
  setting: PropTypes.shape().isRequired,
}

Speed.propTypes = {
  setting: PropTypes.shape().isRequired,
}

Regular.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SettingModal
