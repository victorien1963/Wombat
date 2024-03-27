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
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import { logoFull } from '../asset'
import apiServices from '../services/apiServices'
// import { AuthContext } from './ContextProvider'

function SettingModal({ setting }) {
  //   const { auth } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const { show, handleClose, copyTarget, handleCopy, article_id } = setting

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
    setdatas(res.setting)
    setstep(res.setting.step || initStep)
  }
  useEffect(() => {
    if (article_id) getArticle()
  }, [article_id])

  const handleDataChange = (key, value) =>
    setdatas({
      ...datas,
      [key]: value,
    })

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
            <Col>
              <Form.Label>Topic</Form.Label>
              <Form.Control
                value={datas.topic}
                onChange={(e) => handleDataChange('topic', e.target.value)}
              />
            </Col>
          </Row>
          <Row
            style={{
              height: '40%',
            }}
          >
            <Col>
              <Form.Label>Location</Form.Label>
              <Form.Select disabled />
            </Col>
            <Col>
              <Form.Label>Language</Form.Label>
              <Form.Select disabled />
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
              action
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '15%',
              }}
            >
              <Form.Check className="my-auto me-2" type="radio" />
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Keyword"
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
              action
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '15%',
              }}
            >
              <Form.Check className="my-auto me-2" type="radio" />
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Title"
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
              action
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '13%',
              }}
            >
              <Form.Check className="my-auto me-2" type="radio" />
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Secondary Keywords Here"
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
          <ListGroup className="h-100 w-100 stepList">
            <ListGroupItem
              action
              className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              style={{
                height: '20%',
              }}
            >
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Heading"
              />
            </ListGroupItem>
            {datas.heading.map((label, i) => (
              <ListGroupItem
                key={i}
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '20%',
                }}
              >
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
              </ListGroupItem>
            ))}
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
        <>
          <Row style={{ zIndex: '2' }} className="mb-3">
            <h3>{datas.title}</h3>
          </Row>
          <Row style={{ zIndex: '1' }} className="mx-auto">
            <Image
              className="position-absolute w-50"
              style={{ opacity: '.15' }}
              src={logoFull}
            />
          </Row>
          <Row style={{ zIndex: '2' }}>{datas.Article.Text}</Row>
        </>
      ),
      complete: true,
    },
  ]

  const [loading, setloading] = useState(false)
  const nextStep = async () => {
    setloading(true)
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

  return (
    <Modal
      style={{ zIndex: '1501', width: '100vw', height: '100vh' }}
      size="xl"
      show={show !== false}
      onHide={() => handleClose(false)}
    >
      <Modal.Header
        className="AccFormModal justify-content-center text-center pt-4"
        closeButton
      >
        <Modal.Title>
          <h4>新建專案</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-flex AccformCard w-100"
        style={{
          height: '80vh',
        }}
      >
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
                ) : (
                  <Col className="ms-auto" />
                )}
                <Col xs={2} className="ms-0 d-flex">
                  <Button
                    className="d-flex w-100 justify-content-center"
                    variant="wom"
                    onClick={() => {
                      if (step.now === 6) {
                        if (!location.pathname.includes('/book')) {
                          navigate(`/book/${article_id}`)
                        }
                        handleClose()
                      } else {
                        nextStep()
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
      </Modal.Body>
    </Modal>
  )
}

SettingModal.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SettingModal
