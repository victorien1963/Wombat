/* eslint-disable no-promise-executor-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useContext, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  faTrashAlt,
  faCirclePlus,
  faBars,
  faCircleExclamation,
  // faCheckSquare,
  faSearch,
  // faFileArrowUp,
  // faCloudArrowDown,
  // faMusic,
  // faGhost,
  // faHeart,
  // faWandMagicSparkles,
  // faFaceLaughSquint,
  // faBrain,
  // faCapsules,
  // faRobot,
  // faPaw,
  // faMeteor,
  // faUtensils,
  // faUserSecret,
  faCheckSquare,
  faReply,
  faCopy,
  faCloudArrowDown,
  faCircleChevronRight,
  faCaretRight,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import {
  AuthContext,
  ToastContext,
  // DraftContext,
} from '../components/ContextProvider'
import apiServices from '../services/apiServices'
import { LoadingButton, Loading, SettingModal } from '../components'
import { logoFull } from '../asset'

function Book({ setting }) {
  const {
    title = 'title',
    user_name,
    id = '1423231412',
    created_on = '19990701',
    content = 'content',
    handleEdit = () => {},
    handleDelete = () => {},
    handleOpen = () => {},
    // handleDownload = () => {},
    handleCopy,
    // handleMove = () => {},
    status,
  } = setting
  return (
    <Card
      className="w-100 h-100"
      style={{
        color: 'rgb(33 5 5)',
        backgroundColor: 'rgb(246 246 246)',
        border: '1px solid rgba(35, 61, 99, 0.7)',
      }}
      onClick={handleOpen}
    >
      <Card.Body className="d-flex flex-column h-100 py-2">
        <Row>
          <p
            className="text-center mb-0 App-oneLineEllipsis fw-bold"
            title={title}
          >
            {title}
          </p>
        </Row>
        <hr className="my-1" />
        <Row>
          <Col className="text-start">{user_name}</Col>
          <Col className="text-ceenter">{`${moment(created_on).format(
            'MMDDhhss'
          )}${id}`}</Col>
          <Col className="text-end">
            {moment(created_on).format('yyyy/MM/DD')}
          </Col>
        </Row>
        <Row
          className="d-flex overflow-scroll p-3"
          style={{
            height: '68%',
          }}
        >
          <p className="m-auto oneline text-start">{content}</p>
        </Row>
        <hr className="my-1" />
        <Row
          className="flex-nowrap justify-content-center py-0"
          style={{
            height: '30px',
          }}
        >
          {!handleCopy ? (
            <Button
              className="h-100 btn-hover-wom my-auto d-flex"
              style={{
                width: '40px',
              }}
              onClick={handleEdit}
              title={status === 'pending' ? '此模板尚未完成' : '檢視'}
              disabled={status === 'pending'}
            >
              <FontAwesomeIcon
                icon={status === 'pending' ? faEyeSlash : faEye}
                style={{
                  cursor: 'pointer',
                }}
                className="m-auto fs-5 h-100 w-100"
              />
            </Button>
          ) : (
            <Button
              variant="h-100 btn-hover-wom my-auto d-flex"
              style={{
                width: '40px',
              }}
              title="套 用"
              onClick={handleCopy}
            >
              <FontAwesomeIcon icon={faCopy} />
            </Button>
          )}
          <Button
            className="h-100 btn-hover-wom my-auto d-flex"
            onClick={(e) => {
              e.stopPropagation()
            }}
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
          {!handleCopy && (
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
          )}
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
                    `專案${target.setting.id || target.project_id}`
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

  const params = useParams()

  const [projectId, setProjectId] = useState('')
  const [editing, setEditing] = useState('')
  useEffect(() => {
    setProjectId(params.project_id)
  }, [params.project_id])

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

  const [projects, setprojects] = useState([])
  const getProjects = async () => {
    const res = await apiServices.data({
      path: '/project',
      method: 'get',
    })
    setprojects(res)
  }
  useEffect(() => {
    getProjects()
  }, [])
  const handleEdit = async () => {
    console.log(projects.find(({ project_id }) => project_id === editing))
    const updated = await apiServices.data({
      path: `/project/${editing}`,
      method: 'put',
      data: projects.find(({ project_id }) => project_id === editing),
    })
    setprojects(projects.map((p) => (p.project_id === editing ? updated : p)))
    setEditing('')
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

  const handleProjectDelete = async (value) => {
    await apiServices.data({
      path: `/project/${value}`,
      method: 'delete',
    })
    setprojects(projects.filter(({ project_id }) => project_id !== value))
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

  // const categories = [
  //   {
  //     label: '音樂',
  //     value: '音樂',
  //     icon: faMusic,
  //     color: '#679fa8',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '愛情',
  //     value: '愛情',
  //     icon: faHeart,
  //     color: '#e78791',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '驚悚',
  //     value: '驚悚',
  //     icon: faGhost,
  //     color: '#a98ccd',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '奇幻',
  //     value: '奇幻',
  //     icon: faWandMagicSparkles,
  //     color: '#d37ed4',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '寵物',
  //     value: '寵物',
  //     icon: faPaw,
  //     color: '#fbab65',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '喜劇',
  //     value: '喜劇',
  //     icon: faFaceLaughSquint,
  //     color: '#f4c84b',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '知識',
  //     value: '知識',
  //     icon: faBrain,
  //     color: '#778af2',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '犯罪',
  //     value: '犯罪',
  //     icon: faUserSecret,
  //     color: 'grey',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '美食',
  //     value: '美食',
  //     icon: faUtensils,
  //     color: '#c25f60',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '醫療',
  //     value: '醫療',
  //     icon: faCapsules,
  //     color: '#68a568',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '科幻',
  //     value: '科幻',
  //     icon: faMeteor,
  //     color: '#945abe',
  //     backgroundColor: '#ddd',
  //   },
  //   {
  //     label: '未來',
  //     value: '未來',
  //     icon: faRobot,
  //     color: '#9a9a9a',
  //     backgroundColor: '#ddd',
  //   },
  // ]

  const [showSetting, setshowSetting] = useState(false)
  const [id, setid] = useState('')

  const handleArticleAdd = async (setting = {}) => {
    const res = await apiServices.data({
      path: `/article/${projectId}`,
      method: 'post',
      data: setting,
    })
    setarticles([res, ...articles])
    setid(res.article_id)
    setshowSetting(true)
  }

  const handleProjectAdd = async () => {
    const res = await apiServices.data({
      path: '/project',
      method: 'post',
    })
    setprojects([res, ...projects])
  }

  const handleProjectChange = (e) => {
    setprojects(
      projects.map((p) =>
        p.project_id === editing
          ? {
              ...p,
              setting: {
                ...p.setting,
                [e.target.name]: e.target.value,
              },
            }
          : p
      )
    )
  }

  const [copyTarget, setcopyTarget] = useState(null)
  const [selected, setselected] = useState('')

  const selectedProject = useMemo(
    () =>
      projectId && projects
        ? projects.find(({ project_id }) => project_id === projectId)
        : {},
    [projectId, projects]
  )

  console.log(selectedProject)

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
        projectId ? (
          <>
            <Row className="py-3">
              <Col className="d-flex justify-content-center">
                <div className="text-nowrap text-wom fs-5 fw-bold">
                  {/* 專案 */}
                  {(selectedProject &&
                    selectedProject.setting &&
                    selectedProject.setting.name) ||
                    `專案${projectId}`}
                </div>
                <FontAwesomeIcon className="my-auto px-4" icon={faCaretRight} />
                <div className="text-nowrap text-wom fs-5 fw-bold">
                  模組列表
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={3} className="d-flex justifu-content-end">
                <Form.Select
                  className="w-100 h-100"
                  aria-label="Default select example"
                  onChange={(e) => setselected(e.target.value)}
                  value={selected}
                >
                  <option value="" className="d-none">
                    選擇推薦劇本類型...
                  </option>
                  {[
                    '所有類型',
                    '奇幻',
                    '科幻',
                    '科普',
                    '喜劇',
                    '愛情',
                    '寵物',
                    '醫療',
                    '未來',
                  ].map((label, i) => (
                    <option key={i} value={label}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col className="d-flex px-0">
                <InputGroup>
                  <Form.Control
                    placeholder="請輸入關鍵字以搜尋..."
                    aria-label="Recipient's username3"
                    aria-describedby="basic-addon3"
                    value={tempSearch}
                    onChange={(event) => setTempSearch(event.target.value)}
                    // onFocus={() => setFocus(true)}
                    // onBlur={() => setFocus(false)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' &&
                        !event.nativeEvent.isComposing
                      )
                        setSearch(tempSearch)
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={(event) => setTempSearch(event.target.value)}
                  >
                    清除
                  </Button>
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
              <Col xs={3} className="d-flex">
                <Button
                  className="w-100 ms-auto me-2"
                  onClick={() => setProjectId('')}
                  variant="outline-wom"
                >
                  回列表&ensp;
                  <FontAwesomeIcon
                    icon={faReply}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="ms-auto my-auto fs-6"
                    title="回列表"
                  />
                </Button>
                <Button
                  className="w-100 ms-auto"
                  onClick={() => handleArticleAdd()}
                  variant="outline-wom"
                >
                  新建模組&ensp;
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="ms-auto my-auto fs-6"
                    title="新增模組"
                  />
                </Button>
              </Col>
            </Row>

            {/* <Row className="my-2 p-2" style={{ height: '10vw' }}>
              {categories.map(({ label, icon, backgroundColor, color }) => (
                <Col key={label} xs={1}>
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
            </Row> */}
            <div
              style={{
                height: '80vh',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {/* 1 */}
              <Row className="px-3 pt-3 fs-5 fw-bold text-wom">最近的模板</Row>
              {articles &&
              articles.filter(({ setting }) => {
                const { name, project_id, category } = setting
                if (parseInt(project_id, 10) !== parseInt(projectId, 10))
                  return false
                const isSearched = !search || (name && name.includes(search))
                const isCategory =
                  !selected || selected === '所有類型' || category === selected
                return isSearched && isCategory
              }).length ? (
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
                              const { name, project_id, category } = setting
                              if (
                                parseInt(project_id, 10) !==
                                parseInt(projectId, 10)
                              )
                                return false
                              const isSearched =
                                !search || (name && name.includes(search))
                              const isCategory =
                                !selected ||
                                selected === '所有類型' ||
                                category === selected
                              return isSearched && isCategory
                            })
                            .map(
                              (
                                {
                                  article_id,
                                  user_name,
                                  setting,
                                  created_on,
                                  updated_on,
                                },
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
                                          title:
                                            setting.title ||
                                            setting.topic ||
                                            '未命名',
                                          user_name,
                                          id: article_id,
                                          created_on,
                                          updated_on,
                                          content:
                                            setting.Article.Text || 'Content',
                                          status: setting.Article.status,
                                          handleEdit: (e) => {
                                            e.stopPropagation()
                                            navigate(
                                              `/book/${projectId}/${article_id}`
                                            )
                                          },
                                          handleDelete: (e) => {
                                            setshowWarn(article_id)
                                            e.stopPropagation()
                                          },
                                          handleOpen: () => {
                                            setid(article_id)
                                            setshowSetting(true)
                                            setcopyTarget(setting)
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
              ) : (
                <div
                  className="w-100 h-60 d-flex"
                  style={{
                    minHeight: '40vh',
                  }}
                >
                  <h4 className="m-auto">尚無資料</h4>
                </div>
              )}

              {/* 2 */}
              <Row className="px-3 pt-3 fs-5 fw-bold text-wom">
                你可能會喜歡...
              </Row>
              {articles &&
              articles.filter(({ setting }) => {
                const { name, category } = setting
                const isSearched = !search || (name && name.includes(search))
                const isCategory =
                  !selected || selected === '所有類型' || category === selected
                return isSearched && isCategory
              }).length ? (
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
                              const { name, category } = setting
                              const isSearched =
                                !search || (name && name.includes(search))
                              const isCategory =
                                !selected ||
                                selected === '所有類型' ||
                                category === selected
                              return isSearched && isCategory
                            })
                            .map(
                              (
                                {
                                  article_id,
                                  user_name,
                                  setting,
                                  created_on,
                                  updated_on,
                                },
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
                                          title:
                                            setting.title ||
                                            setting.topic ||
                                            '未命名',
                                          user_name,
                                          id: article_id,
                                          created_on,
                                          updated_on,
                                          content:
                                            setting.Article.Text || 'Content',
                                          handleEdit: (e) => {
                                            e.stopPropagation()
                                            navigate(
                                              `/book/${projectId}/${article_id}`
                                            )
                                          },
                                          handleDelete: (e) => {
                                            setshowWarn(article_id)
                                            e.stopPropagation()
                                          },
                                          handleOpen: () => {
                                            setid(article_id)
                                            setshowSetting(true)
                                            setcopyTarget(setting)
                                          },
                                          handleCopy: (e) => {
                                            e.stopPropagation()
                                            handleArticleAdd({
                                              ...setting,
                                              project_id: projectId,
                                              title: `複製 - ${setting.title}`,
                                            })
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
              ) : (
                <div
                  className="w-100 h-60 d-flex"
                  style={{
                    minHeight: '40vh',
                  }}
                >
                  <h4 className="m-auto">尚無資料</h4>
                </div>
              )}
            </div>
          </>
        ) : (
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
                      if (
                        event.key === 'Enter' &&
                        !event.nativeEvent.isComposing
                      )
                        setSearch(tempSearch)
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={(event) => setTempSearch(event.target.value)}
                  >
                    清除
                  </Button>
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
              <Col xs={3} className="d-flex">
                <Button
                  className="w-100 ms-auto"
                  onClick={handleProjectAdd}
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
            <div
              style={{
                height: '80vh',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <DragDropContext
                onDragEnd={(e) => {
                  const result = Array.from(projects)
                  const [removed] = result.splice(e.source.index, 1)
                  result.splice(e.destination.index, 0, removed)
                  setprojects(result)
                }}
              >
                <Droppable droppableId="droppable" direction="vertical">
                  {(dropProvided, dropSnapshot) => (
                    <div
                      {...dropProvided.droppableProps}
                      ref={dropProvided.innerRef}
                      style={getListStyle(dropSnapshot.isDraggingOver)}
                      className="w-100 h-100 d-flex flex-column overflow-scroll"
                    >
                      {projects ? (
                        projects
                          .filter(({ setting }) => {
                            const { name } = setting
                            return !search || (name && name.includes(search))
                          })
                          .map(
                            (
                              { project_id, setting, created_on, updated_on },
                              i
                            ) => (
                              <Draggable
                                key={`${project_id}`}
                                draggableId={`${project_id}`}
                                index={i}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    className="w-100 my-2"
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    style={{
                                      ...getItemStyle(
                                        dragSnapshot.isDragging,
                                        dragProvided.draggableProps.style
                                      ),
                                      minHeight: '90px',
                                      maxHeight: '90px',
                                      // minWidth: '32%',
                                      // width: '32%',
                                      // height: '40vh',
                                    }}
                                  >
                                    <Row
                                      key={project_id}
                                      className="w-100 h-100 mx-0 p-0 text-dai fw-bold rounded my-1 py-2 text-center"
                                      onClick={() => setProjectId(project_id)}
                                      style={{
                                        border:
                                          '1px solid rgb(35, 61, 99, 0.7)',
                                        backgroundColor: 'rgb(35, 61, 99, 0.1)',
                                      }}
                                    >
                                      {/* <Col xs={1} className="d-flex">
                                        <Form.Control
                                          className="my-auto h-75 py-0 fw-regular fs-7 text-dai text-center"
                                          style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            boxShadow:
                                              editing === project_id
                                                ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                                : '',
                                            color: '#0a004e',
                                            fontWeight: '700',
                                          }}
                                          onClick={(e) => {
                                            if (
                                              editing &&
                                              editing !== project_id
                                            ) {
                                              setEditing(project_id)
                                            }
                                            e.stopPropagation()
                                          }}
                                          // defaultValue={setting.id || project_id}
                                          // value={setting.name || ''}
                                          onChange={() => {}}
                                        />
                                      </Col> */}
                                      <Col
                                        xs={3}
                                        className="d-flex h-100 flex-column"
                                      >
                                        <Form.Control
                                          name="name"
                                          className="my-auto h-75 py-0 fw-regular fs-7 text-dai text-center"
                                          style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            boxShadow:
                                              editing === project_id
                                                ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                                : '',
                                            color: '#0a004e',
                                            fontWeight: '700',
                                          }}
                                          onClick={(e) => {
                                            if (editing !== project_id) {
                                              setEditing(project_id)
                                            }
                                            e.stopPropagation()
                                          }}
                                          defaultValue={
                                            setting.name ||
                                            `專案${setting.id || project_id}`
                                          }
                                          title={
                                            setting.name ||
                                            `專案${setting.id || project_id}`
                                          }
                                          // value={setting.name || ''}
                                          onChange={handleProjectChange}
                                        />
                                      </Col>
                                      <Col xs={3} className="d-flex">
                                        <Form.Control
                                          name="remark"
                                          className="my-auto h-75 py-0 fw-regular fs-7 text-dai text-center"
                                          style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            boxShadow:
                                              editing === project_id
                                                ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                                : '',
                                            color: '#0a004e',
                                            fontWeight: '700',
                                          }}
                                          placeholder={
                                            editing === project_id
                                              ? '編 輯 備 註...'
                                              : ''
                                          }
                                          title={
                                            setting.remark || '編 輯 備 註...'
                                          }
                                          defaultValue={setting.remark || ''}
                                          // value={setting.name || ''}
                                          onClick={(e) => {
                                            if (editing !== project_id) {
                                              setEditing(project_id)
                                            }
                                            e.stopPropagation()
                                          }}
                                          onChange={handleProjectChange}
                                        />
                                      </Col>
                                      <Col xs={2} className="d-flex">
                                        <p className="m-auto">
                                          建立日期：
                                          {moment(created_on)
                                            .tz('Asia/Taipei')
                                            .format('yyyy-MM-DD')}
                                        </p>
                                      </Col>
                                      <Col xs={2} className="d-flex">
                                        <p className="m-auto">
                                          最後更新：
                                          {moment(updated_on)
                                            .tz('Asia/Taipei')
                                            .format('yyyy-MM-DD')}
                                        </p>
                                      </Col>
                                      <Col
                                        xs={2}
                                        className="d-flex justify-content-center"
                                      >
                                        <Button
                                          className="w-25 h-50 btn-hover-wom my-auto"
                                          onClick={() =>
                                            setProjectId(project_id)
                                          }
                                          title="進 入 專 案"
                                        >
                                          <FontAwesomeIcon
                                            icon={faCircleChevronRight}
                                            style={{
                                              cursor: 'pointer',
                                            }}
                                            className="m-auto fs-5"
                                          />
                                        </Button>
                                        <Button
                                          className="w-25 h-50 btn-hover-wom my-auto"
                                          onClick={(e) => {
                                            if (
                                              editing &&
                                              project_id === editing
                                            ) {
                                              handleEdit()
                                            } else {
                                              setEditing(project_id)
                                            }
                                            e.stopPropagation()
                                          }}
                                          title={
                                            editing === project_id
                                              ? '儲 存 變 更'
                                              : '編 輯 名 稱 ＆ 備 註'
                                          }
                                        >
                                          <FontAwesomeIcon
                                            icon={
                                              editing === project_id
                                                ? faCheckSquare
                                                : faEdit
                                            }
                                            style={{
                                              cursor: 'pointer',
                                            }}
                                            className="m-auto fs-5"
                                          />
                                        </Button>
                                        <Button
                                          className="w-25 h-50 btn-hover-wom my-auto"
                                          onClick={(e) => {
                                            setshowWarn(project_id)
                                            e.stopPropagation()
                                          }}
                                          title="刪 除"
                                        >
                                          <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            style={{
                                              cursor: 'pointer',
                                            }}
                                            className="my-auto fs-5"
                                          />
                                        </Button>
                                        <FontAwesomeIcon
                                          icon={faBars}
                                          style={
                                            {
                                              // cursor: 'grabbing',
                                            }
                                          }
                                          className="w-25 my-auto fs-5 text-dai-light"
                                          // onClick={() => handleDraftDelete(project_id)}
                                          title="排 序"
                                        />
                                      </Col>
                                    </Row>
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
        )
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
            if (value) {
              if (projectId) handleArticleDelete(value)
              else handleProjectDelete(value)
            }
            setshowWarn(false)
          },
        }}
      />
      <SettingModal
        setting={{
          show: showSetting,
          handleClose: () => {
            setshowSetting(false)
            setcopyTarget(null)
          },
          copyTarget,
          handleCopy: () => {
            setshowSetting(false)
            handleArticleAdd({
              ...copyTarget,
              title: `複製 - ${copyTarget.title}`,
            })
          },
          article_id: id,
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
