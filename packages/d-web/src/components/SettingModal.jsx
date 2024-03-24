import React, { useState } from 'react'
import {
  Modal,
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  Form,
  Button,
  Image,
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import { logoFull } from '../asset'
// import { AuthContext } from './ContextProvider'

function SettingModal({ setting }) {
  //   const { auth } = useContext(AuthContext)
  const { show, handleClose } = setting

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
        'Introduction',
        'First Section',
        'Second Section',
        'Final Section',
        'Ending',
      ],
      [
        'Introduction',
        'First Section',
        'Second Section',
        'Final Section',
        'Ending',
      ],
      [
        'Introduction',
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
      content: [
        {
          Section: 'Introduction',
          Text: 'This is Introduction',
        },
        {
          Section: 'First Section',
          Text: 'This is First Section',
        },
        {
          Section: 'Second Section',
          Text: 'This is Second Section',
        },
        {
          Section: 'Final Section',
          Text: 'This is Final Section',
        },
        {
          Section: 'Ending',
          Text: 'This is Ending',
        },
      ],
      status: 'pending',
    },
  })
  const handleDataChange = (key, value) =>
    setdatas({
      ...datas,
      [key]: value,
    })

  const [step, setstep] = useState({
    now: 0,
    max: 0,
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
              <Form.Select />
            </Col>
            <Col>
              <Form.Label>Language</Form.Label>
              <Form.Select />
            </Col>
          </Row>
        </>
      ),
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
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '15%',
                }}
              >
                <Form.Check className="my-auto me-2" type="radio" />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
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
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '15%',
                }}
              >
                <Form.Check className="my-auto me-2" type="radio" />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
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
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '13%',
                }}
              >
                <Form.Check className="my-auto me-2" />
                <span className="my-auto">{label}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
    },
    // {
    //   title: 'Additional Settings',
    //   form: <div />,
    // },
    {
      title: 'Select Headings',
      form: (
        <>
          <Row>
            <h3>Select an Outline to Structure Your Content</h3>
          </Row>
          <Row>
            <h6>
              Choose an outline that best represents the structure and flow you
              envision for your article.
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
              <Form.Check className="my-auto me-1" type="radio" />
              <Form.Control
                size="sm"
                className="h-75 my-auto border-0"
                placeholder="Add Your Own Title"
              />
            </ListGroupItem>
            {datas.headings.map((hs) => (
              <ListGroupItem
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
              >
                <div className="me-2">
                  <Form.Check className="my-auto" type="radio" />
                </div>
                <Col>
                  {hs.map((h, i) => (
                    <p key={h} className="w-100 my-0">
                      Section {i + 1}: {h}
                    </p>
                  ))}
                </Col>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
    },
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
            {datas.heading.map((label) => (
              <ListGroupItem
                action
                className="rounded-radius d-flex my-1 border rounded-top rounded-bottom"
                style={{
                  height: '20%',
                }}
              >
                <Form.Control className="my-auto border-0" value={label} />
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      ),
    },
    {
      title: 'Generate Article',
      form: (
        <>
          <Row>
            <h3>{datas.title}</h3>
          </Row>
          <Row>
            <Image className="w-50 mx-auto" src={logoFull} />
          </Row>
          <Row>
            {datas.Article.content.map((c) => (
              <Row>{c.Text}</Row>
            ))}
          </Row>
        </>
      ),
    },
  ]

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
            <ListGroup className="h-100 w-100 rounded-radius stepList">
              {steps.map(({ title }, index) => (
                <ListGroupItem
                  action
                  active={index === step.now}
                  //   disabled={index > step.max}
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
          </Col>
          <Col xs={9} className="d-flex h-100">
            <div className="my-auto w-100 h-100 py-5">
              <Row
                className="overflow-scroll"
                style={{
                  height: '90%',
                  maxHeight: '90%',
                }}
              >
                {steps[step.now].form}
              </Row>
              <Row>
                <Col xs={2} className="ms-auto">
                  <Button
                    onClick={() =>
                      setstep({
                        now: step.now + 1,
                        max: Math.max(step.now + 1, step.max),
                      })
                    }
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      {/* <Modal.Footer className="sendForm justify-content-center py-3">
        <Button variant="secondary" onClick={() => handleClose(false)}>
          取消
        </Button>
        <Button variant="wom" onClick={() => handleClose(show)}>
          確定
        </Button>
      </Modal.Footer> */}
    </Modal>
  )
}

SettingModal.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SettingModal