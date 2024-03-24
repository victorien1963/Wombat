/* eslint-disable no-promise-executor-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-timezone'
import {
  Form,
  InputGroup,
  Image,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Card,
} from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faEdit,
  faTrashAlt,
  faCirclePlus,
  faBars,
  faCircleExclamation,
  // faCheckSquare,
  faSearch,
  // faFileArrowUp,
  faCloudArrowDown,
  faMusic,
  faGhost,
  faHeart,
  faWandMagicSparkles,
  faFaceLaughSquint,
  faBrain,
  faCapsules,
  faRobot,
  faPaw,
  faMeteor,
  faUtensils,
  faUserSecret,
} from '@fortawesome/free-solid-svg-icons'
import {
  AuthContext,
  ToastContext,
  // DraftContext,
} from '../components/ContextProvider'
import apiServices from '../services/apiServices'
import file from '../services/file'
import { LoadingButton, Loading, SettingModal } from '../components'
import { logoFull } from '../asset'

function Book({ setting }) {
  const {
    title = 'title',
    id = '1423231412',
    created_on = '19990701',
    content = 'content',
    handleEdit = () => {},
    handleDelete = () => {},
    handleDownload = () => {},
    // handleMove = () => {},
  } = setting
  return (
    <Card
      className="w-100 h-100 fw-bold"
      style={{
        color: 'rgb(33 5 5)',
        backgroundColor: 'rgb(246 246 246)',
        border: '1px solid rgba(35, 61, 99, 0.7)',
      }}
    >
      <Card.Body className="d-flex flex-column py-2">
        <Row>
          <p className="text-center mb-0">{title}</p>
        </Row>
        <hr className="my-1" />
        <Row>
          <Col className="text-start">{id}</Col>
          <Col className="text-end">
            {moment(created_on).format('yyyy-MM-DD')}
          </Col>
        </Row>
        <Row className="flex-fill d-flex">
          <p className="m-auto">{content}</p>
        </Row>
        <hr className="my-1" />
        <Row
          className="flex-nowrap justify-content-center py-0"
          style={{
            height: '30px',
          }}
        >
          <Button
            className="h-100 btn-hover-wom my-auto d-flex"
            style={{
              width: '40px',
            }}
            onClick={handleEdit}
            title="編 輯"
          >
            <FontAwesomeIcon
              icon={faEdit}
              style={{
                cursor: 'pointer',
              }}
              className="m-auto fs-5 h-100 w-100"
            />
          </Button>
          <Button
            className="h-100 btn-hover-wom my-auto d-flex"
            onClick={handleDelete}
            style={{
              width: '40px',
            }}
            title="刪 除"
          >
            <FontAwesomeIcon
              icon={faTrashAlt}
              style={{
                cursor: 'pointer',
              }}
              className="m-auto fs-5 h-100 w-100"
            />
          </Button>
          <Button
            className="h-100 btn-hover-wom my-auto d-flex"
            onClick={handleDownload}
            style={{
              width: '40px',
            }}
            title="匯出專案"
          >
            <FontAwesomeIcon
              icon={faCloudArrowDown}
              style={{
                cursor: 'pointer',
              }}
              className="m-auto fs-5 h-100 w-100"
            />
          </Button>
          <Button
            className="h-100 btn-hover-wom my-auto d-flex"
            // onClick={() => {}}
            style={{
              width: '40px',
            }}
            title="排序"
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{
                cursor: 'pointer',
              }}
              className="m-auto fs-5 h-100 w-100"
            />
          </Button>
        </Row>
      </Card.Body>
    </Card>
  )
}

function Warn({ setting }) {
  const { size = 'md', show = false, handleClose } = setting

  return (
    <Modal
      style={{ zIndex: '1501' }}
      size={size}
      show={show !== false}
      onHide={() => handleClose(false)}
    >
      <Modal.Header
        className="AccFormModal justify-content-center text-center pt-4"
        closeButton
      >
        <Modal.Title>
          <h4>系統訊息</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex AccformCard">
        <div className="assPermis w-100">
          <Form className="px-2 Form-card flex-grow-1">
            <Form.Group className="px-5 lh-md text-center text-wom">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ height: '5rem' }}
                className="my-4"
              />
              <Form.Label className="w-100 fs-5 fw-bold text-center pb-4">
                確定要刪除
                {/* {show && target
                  ? target.setting.name ||
                    `專案${target.setting.id || target.draft_id}`
                  : '專案'} */}
                嗎？
              </Form.Label>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className="sendForm justify-content-center py-3">
        <Button variant="secondary" onClick={() => handleClose(false)}>
          取消
        </Button>
        <Button variant="wom" onClick={() => handleClose(show)}>
          確定
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function Home() {
  const { auth, setAuth } = useContext(AuthContext)
  const { setToast } = useContext(ToastContext)
  const navigate = useNavigate()

  const [reveal, setReveal] = useState(false)
  const fields = [
    {
      label: '帳號',
      type: 'text',
      name: 'email',
      placeholder: '帳號',
    },
    {
      label: '密碼',
      type: 'password',
      name: 'password',
      placeholder: '密碼',
    },
  ]
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const onDataChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }
  const handleLogin = async () => {
    const { token } = await apiServices.login(data)
    if (!token) {
      setToast({ show: true, text: '登 入 失 敗' })
      return
    }
    document.cookie = `token=${token}; Domain=${window.location.hostname}; Path=/;`
    const { user } = await apiServices.me()
    setAuth({
      authed: true,
      ...user,
    })
  }

  const [articles, setarticles] = useState([])
  const getArticles = async () => {
    const res = await apiServices.data({
      path: '/article',
      method: 'get',
    })
    setarticles(res)
  }
  useEffect(() => {
    getArticles()
  }, [])

  const handleArticleDelete = async (value) => {
    await apiServices.data({
      path: `/article/${value}`,
      method: 'delete',
    })
    setarticles(articles.filter(({ article_id }) => article_id !== value))
  }

  // const [editing, setEditing] = useState('')
  // const [focus, setFocus] = useState(false)
  const [tempSearch, setTempSearch] = useState('')
  const [search, setSearch] = useState('')

  const grid = 0
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    cursor: isDragging ? 'grab' : 'pointer',
    ...draggableStyle,
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    padding: grid,
    width: '100%',
  })

  const [showWarn, setshowWarn] = useState(false)
  const [loading, setloading] = useState(false)

  const categories = [
    {
      label: '音樂',
      value: '音樂',
      icon: faMusic,
      color: '#317985',
      backgroundColor: '#c9e4e5',
    },
    {
      label: '愛情',
      value: '愛情',
      icon: faHeart,
      color: '#dc3545',
      backgroundColor: '#ffe8f4',
    },
    {
      label: '驚悚',
      value: '驚悚',
      icon: faGhost,
      color: '#212529',
      backgroundColor: '#dfd9e3',
    },
    {
      label: '奇幻',
      value: '奇幻',
      icon: faWandMagicSparkles,
      color: 'purple',
      backgroundColor: '#f8edff',
    },
    {
      label: '寵物',
      value: '寵物',
      icon: faPaw,
      color: 'orange',
      backgroundColor: '#ffe4d0',
    },
    {
      label: '喜劇',
      value: '喜劇',
      icon: faFaceLaughSquint,
      color: '#ffc008',
      backgroundColor: 'rgb(255 236 177)',
    },
    {
      label: '知識',
      value: '知識',
      icon: faBrain,
      color: '#4b64e8',
      backgroundColor: '#dde5ee',
    },
    {
      label: '犯罪',
      value: '犯罪',
      icon: faUserSecret,
      color: 'grey',
      backgroundColor: '#ddd',
    },
    {
      label: '美食',
      value: '美食',
      icon: faUtensils,
      color: 'brown',
      backgroundColor: 'rgb(255 223 223)',
    },
    {
      label: '醫療',
      value: '醫療',
      icon: faCapsules,
      color: 'green',
      backgroundColor: '#eed',
    },
    {
      label: '科幻',
      value: '科幻',
      icon: faMeteor,
      color: 'indigo',
      backgroundColor: '#e7ddee',
    },
    {
      label: '未來',
      value: '未來',
      icon: faRobot,
      color: '#666',
      backgroundColor: '#ddd',
    },
  ]

  const [showSetting, setshowSetting] = useState(false)

  const handleArticleAdd = async () => {
    const res = await apiServices.data({
      path: '/article',
      method: 'post',
    })
    setarticles([res, ...articles])
    setshowSetting(true)
  }

  return (
    <Container
      className="bg-dots-light h-100 w-100 d-flex flex-column position-relative"
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
      // onClick={() => setEditing('')}
    >
      <Loading
        setting={{
          time: 50,
          show: loading,
          step: '下載圖片中......',
          handleInterrupt: () => setloading(false),
        }}
      />
      {auth.authed ? (
        <>
          <Row className="py-3">
            <Col>
              <h5 className="text-nowrap text-wom">專案列表</h5>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex pe-0">
              <InputGroup>
                <Form.Control
                  placeholder="請輸入關鍵字以搜尋..."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  value={tempSearch}
                  onChange={(event) => setTempSearch(event.target.value)}
                  // onFocus={() => setFocus(true)}
                  // onBlur={() => setFocus(false)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.nativeEvent.isComposing)
                      setSearch(tempSearch)
                  }}
                />
                <Button
                  variant="outline-wom"
                  id="button-addon2"
                  title="搜 尋"
                  onClick={() => setSearch(tempSearch)}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Col>
            <Col xs={2} className="d-flex">
              {/* <Button
                className="w-100 ms-auto me-2"
                onClick={() => ref.current.click()}
                variant="outline-wom"
              >
                上傳專案&ensp;
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  style={{
                    cursor: 'pointer',
                  }}
                  className="ms-auto my-auto fs-6"
                  title="上傳專案"
                />
              </Button>
              <input
                ref={ref}
                style={{
                  visibility: 'hidden',
                  width: '0',
                  height: '0',
                }}
                type="file"
                id="xlsx"
                name="xlsx"
                accept=".xlsx"
                onChange={(e) => {
                  handleCsvUpload(e)
                  e.target.value = ''
                }}
              /> */}
              <Button
                className="w-100 ms-auto"
                onClick={handleArticleAdd}
                variant="outline-wom"
              >
                新建專案&ensp;
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  style={{
                    cursor: 'pointer',
                  }}
                  className="ms-auto my-auto fs-6"
                  title="新增專案"
                />
              </Button>
            </Col>
          </Row>

          <Row className="my-2 p-2" style={{ height: '10vw' }}>
            {categories.map(({ label, icon, backgroundColor, color }) => (
              <Col xs={1}>
                <div
                  className="m-auto"
                  style={{
                    display: 'flex',
                    borderRadius: '50%',
                    backgroundColor,
                    height: '4vw',
                    width: '4vw',
                  }}
                >
                  <FontAwesomeIcon
                    style={{ color }}
                    className="m-auto fs-4"
                    icon={icon}
                  />
                </div>
                <h6 className="m-auto py-1">{label}</h6>
              </Col>
            ))}
          </Row>
          <div
            style={{
              height: '80vh',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* 1 */}
            <Row className="px-3 fs-5 fw-bold text-wom">最近的模板</Row>
            <DragDropContext
              onDragEnd={(e) => {
                const result = Array.from(articles)
                const [removed] = result.splice(e.source.index, 1)
                result.splice(e.destination.index, 0, removed)
                setarticles(result)
              }}
            >
              <Droppable droppableId="droppable" direction="horizonal">
                {(dropProvided, dropSnapshot) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                    className="w-100 h-60 d-flex overflow-scroll"
                  >
                    {articles ? (
                      articles
                        .filter(({ setting }) => {
                          const { name } = setting
                          return !search || (name && name.includes(search))
                        })
                        .map(
                          (
                            { article_id, setting, created_on, updated_on },
                            i
                          ) => (
                            <Draggable
                              key={`${article_id}`}
                              draggableId={`${article_id}`}
                              index={i}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  className="me-3"
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...getItemStyle(
                                      dragSnapshot.isDragging,
                                      dragProvided.draggableProps.style
                                    ),
                                    minWidth: '32%',
                                    width: '32%',
                                    height: '40vh',
                                  }}
                                >
                                  <Book
                                    setting={{
                                      title: 'Title',
                                      id: article_id,
                                      created_on,
                                      updated_on,
                                      content: 'Content',
                                      handleEdit: () => {
                                        navigate(`/book/${article_id}`)
                                      },
                                      handleDelete: (e) => {
                                        setshowWarn(article_id)
                                        e.stopPropagation()
                                      },
                                      handleDownload: async (e) => {
                                        e.stopPropagation()
                                        setloading(true)
                                        await file.makeFile(
                                          setting,
                                          [
                                            'module1',
                                            'module2',
                                            'module3',
                                            'module4',
                                          ],
                                          async (downloadFunc) => {
                                            const delay = (ms) =>
                                              new Promise((resolve) =>
                                                setTimeout(resolve, ms)
                                              )
                                            await delay(5000)

                                            setloading((prevState) => {
                                              if (prevState) downloadFunc()
                                              return false
                                            })
                                          }
                                        )
                                      },
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        )
                    ) : (
                      <Row>
                        <Col>專案名</Col>
                        <Col>狀態</Col>
                        <Col>建立日期</Col>
                        <Col>更新時間</Col>
                        <Col>備註</Col>
                        <Col>操作</Col>
                      </Row>
                    )}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* 2 */}
            <Row className="px-3 pt-3 fs-5 fw-bold text-wom">
              你可能會喜歡...
            </Row>
            <DragDropContext
              onDragEnd={(e) => {
                const result = Array.from(articles)
                const [removed] = result.splice(e.source.index, 1)
                result.splice(e.destination.index, 0, removed)
                setarticles(result)
              }}
            >
              <Droppable droppableId="droppable" direction="horizonal">
                {(dropProvided, dropSnapshot) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                    className="w-100 h-60 d-flex overflow-scroll"
                  >
                    {articles ? (
                      articles
                        .filter(({ setting }) => {
                          const { name } = setting
                          return !search || (name && name.includes(search))
                        })
                        .map(
                          (
                            { article_id, setting, created_on, updated_on },
                            i
                          ) => (
                            <Draggable
                              key={`${article_id}`}
                              draggableId={`${article_id}`}
                              index={i}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  className="me-3"
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...getItemStyle(
                                      dragSnapshot.isDragging,
                                      dragProvided.draggableProps.style
                                    ),
                                    minWidth: '32%',
                                    width: '32%',
                                    height: '40vh',
                                  }}
                                >
                                  <Book
                                    setting={{
                                      title: 'Title',
                                      id: article_id,
                                      created_on,
                                      updated_on,
                                      content: 'Content',
                                      handleEdit: () => {
                                        navigate(`/book/${article_id}`)
                                      },
                                      handleDelete: (e) => {
                                        setshowWarn(article_id)
                                        e.stopPropagation()
                                      },
                                      handleDownload: async (e) => {
                                        e.stopPropagation()
                                        setloading(true)
                                        await file.makeFile(
                                          setting,
                                          [
                                            'module1',
                                            'module2',
                                            'module3',
                                            'module4',
                                          ],
                                          async (downloadFunc) => {
                                            const delay = (ms) =>
                                              new Promise((resolve) =>
                                                setTimeout(resolve, ms)
                                              )
                                            await delay(5000)

                                            setloading((prevState) => {
                                              if (prevState) downloadFunc()
                                              return false
                                            })
                                          }
                                        )
                                      },
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        )
                    ) : (
                      <Row>
                        <Col>專案名</Col>
                        <Col>狀態</Col>
                        <Col>建立日期</Col>
                        <Col>更新時間</Col>
                        <Col>備註</Col>
                        <Col>操作</Col>
                      </Row>
                    )}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex" style={{ height: '65%' }}>
            <Image
              className="mt-auto mx-auto"
              src={logoFull}
              style={{ height: '25rem', width: 'auto' }}
            />
          </div>
          <div className="d-flex w-100 mb-auto" style={{ height: '35%' }}>
            <Form className="py-3 px-5 mx-auto d-flex flex-column">
              {fields.map((field) => (
                <Form.Group key={field.name} className="d-flex mb-2">
                  {/* <Form.Label>{field.label}</Form.Label> */}
                  {field.type === 'password' ? (
                    <InputGroup
                      id="defaultBorder"
                      className="rounded input-group-transparent-addon w-100"
                    >
                      <Form.Control
                        name={field.name}
                        type={reveal ? 'text' : field.type}
                        onChange={onDataChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.isComposing) handleLogin()
                        }}
                        placeholder={field.placeholder}
                      />
                      <InputGroup.Text>
                        <FontAwesomeIcon
                          className="fs-6"
                          style={{
                            right: '10',
                            top: '50',
                            bottom: '50',
                            cursor: 'pointer',
                          }}
                          title={reveal ? '點擊以隱藏密碼' : '點擊以顯示密碼'}
                          icon={reveal ? faEye : faEyeSlash}
                          onClick={() => setReveal(!reveal)}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  ) : (
                    <Form.Control
                      name={field.name}
                      type={field.type}
                      onChange={onDataChange}
                      placeholder={field.placeholder}
                    />
                  )}
                </Form.Group>
              ))}
              <LoadingButton
                className="mx-auto my-2"
                variant="outline-wom"
                onClick={handleLogin}
                btnText="登入"
              />
              <div className="d-flex">
                <span
                  className="w-100 mx-auto small"
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => navigate('/register')}
                  aria-hidden
                >
                  註冊
                </span>
              </div>
            </Form>
          </div>
        </>
      )}
      <Warn
        setting={{
          show: showWarn,
          handleClose: (value) => {
            if (value) handleArticleDelete(value)
            setshowWarn(false)
          },
        }}
      />
      <SettingModal
        setting={{
          show: showSetting,
          handleClose: () => setshowSetting(false),
        }}
      />
    </Container>
  )
}

Warn.propTypes = {
  setting: PropTypes.shape().isRequired,
}

Book.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default Home
