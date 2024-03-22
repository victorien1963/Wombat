/* eslint-disable no-promise-executor-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useContext, useRef } from 'react'
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
  faCheckSquare,
  faSearch,
  faFileArrowUp,
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
  DraftContext,
} from '../components/ContextProvider'
import apiServices from '../services/apiServices'
import file from '../services/file'
import { LoadingButton, Loading } from '../components'
import { logoFull } from '../asset'

function Warn({ setting }) {
  const { size = 'md', show = false, handleClose } = setting
  const { drafts } = useContext(DraftContext)
  const target = drafts ? drafts.find((d) => d.draft_id === show) : null

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
                {show && target
                  ? target.setting.name ||
                    `專案${target.setting.id || target.draft_id}`
                  : '專案'}
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

  const {
    drafts,
    setDraftId,
    setDraft,
    setDrafts,
    handleDraftAdd,
    handleDraftDelete,
  } = useContext(DraftContext)

  const [editing, setEditing] = useState('')
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

  const ref = useRef(null)
  const handleCsvUpload = () => {
    if (!ref.current) return
    file.readFile(
      ref.current.files[0],
      ['module1', 'module2', 'module3', 'module4'],
      (res) => {
        handleDraftAdd(res)
      }
    )
  }

  return (
    <Container
      className="bg-dots-light h-100 w-100 d-flex flex-column position-relative"
      onClick={() => setEditing('')}
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
            <Col xs={4} className="d-flex">
              <Button
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
              />
              <Button
                className="w-100 ms-auto"
                onClick={() => handleDraftAdd()}
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
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#c9e4e5',
                  height: '4vw',
                  width: '4vw',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: '#317985' }}
                  className="m-auto fs-4"
                  icon={faMusic}
                />
              </div>
              <h6 className="m-auto py-1">音樂</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#ffe8f4',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  className="m-auto text-danger fs-4"
                  icon={faHeart}
                />
              </div>
              <h6 className="m-auto py-1">愛情</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#dfd9e3',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  className="text-dark m-auto fs-4"
                  icon={faGhost}
                />
              </div>
              <h6 className="m-auto py-1">驚悚</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#f8edff',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'purple' }}
                  className="m-auto fs-4"
                  icon={faWandMagicSparkles}
                />
              </div>
              <h6 className="m-auto py-1">奇幻</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#ffe4d0',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'orange' }}
                  className="m-auto fs-4"
                  icon={faPaw}
                />
              </div>
              <h6 className="m-auto py-1">寵物</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: 'rgb(255 236 177)',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  className="text-warning m-auto fs-5"
                  icon={faFaceLaughSquint}
                />
              </div>
              <h6 className="m-auto py-1">喜劇</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#dde5ee',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: '#4b64e8' }}
                  className="m-auto fs-4"
                  icon={faBrain}
                />
              </div>
              <h6 className="m-auto py-1">知識</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#ddd',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'grey' }}
                  className="m-auto fs-4"
                  icon={faUserSecret}
                />
              </div>
              <h6 className="m-auto py-1">犯罪</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: 'rgb(255 223 223)',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'brown' }}
                  className="m-auto fs-4"
                  icon={faUtensils}
                />
              </div>
              <h6 className="m-auto py-1">美食</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#eed',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'green' }}
                  className="m-auto fs-4"
                  icon={faCapsules}
                />
              </div>
              <h6 className="m-auto py-1">醫療</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#e7ddee',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: 'indigo' }}
                  className="m-auto fs-4"
                  icon={faMeteor}
                />
              </div>
              <h6 className="m-auto py-1">科幻</h6>
            </Col>
            <Col xs={1}>
              <div
                className="m-auto"
                style={{
                  display: 'flex',
                  borderRadius: '50%',
                  backgroundColor: '#ddd',
                  height: '4vw',
                  width: '4vw',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon
                  style={{ color: '#666' }}
                  className="m-auto fs-4"
                  icon={faRobot}
                />
              </div>
              <h6 className="m-auto py-1">未來</h6>
            </Col>
          </Row>

          <div
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              height: 'auto',
            }}
          >
            {/* 1 */}
            <Row className="px-3 fs-5 fw-bold text-wom">最近的模板</Row>
            <DragDropContext
              onDragEnd={(e) => {
                const result = Array.from(drafts)
                const [removed] = result.splice(e.source.index, 1)
                result.splice(e.destination.index, 0, removed)
                setDrafts(result)
              }}
            >
              <Droppable droppableId="droppable" direction="vertical">
                {(dropProvided, dropSnapshot) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                    className="w-100 h-auto"
                  >
                    {drafts ? (
                      drafts
                        .filter(({ setting }) => {
                          const { name, remark } = setting
                          return (
                            !search ||
                            (name && name.includes(search)) ||
                            (remark && remark.includes(search))
                          )
                        })
                        .map(
                          (
                            { draft_id, setting, created_on, updated_on },
                            i
                          ) => (
                            <Draggable
                              key={`${draft_id}`}
                              draggableId={`${draft_id}`}
                              index={i}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...getItemStyle(
                                      dragSnapshot.isDragging,
                                      dragProvided.draggableProps.style
                                    ),
                                    height: '100px',
                                    // className="position-absolute text-wom" fs-7"
                                    // top: `${5}%`,
                                    // left: `${3 + i * 32}%`,
                                    // height: '85%',
                                    // width: '30%',
                                  }}
                                >
                                  <Row
                                    key={draft_id}
                                    className="w-100 h-100 mx-0 p-0 text-wom fw-bold rounded my-1 py-2 text-center"
                                    onClick={() => setDraftId(draft_id)}
                                    style={{
                                      border: '1px solid rgb(99, 35, 35, 0.7)',
                                      backgroundColor: 'rgb(254 215 187 / 11%)',
                                    }}
                                  >
                                    <Col xs={1} className="d-flex">
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        defaultValue={setting.id || draft_id}
                                        // value={setting.name || ''}
                                        onChange={(e) =>
                                          setDraft(
                                            { id: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col
                                      xs={3}
                                      className="d-flex h-100 flex-column"
                                    >
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        defaultValue={
                                          setting.name ||
                                          `專案${setting.id || draft_id}`
                                        }
                                        // value={setting.name || ''}
                                        onChange={(e) =>
                                          setDraft(
                                            { name: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={3} className="d-flex">
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        placeholder={
                                          editing === draft_id
                                            ? '編輯備註...'
                                            : ''
                                        }
                                        defaultValue={setting.remark || ''}
                                        // value={setting.name || ''}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        onChange={(e) =>
                                          setDraft(
                                            { remark: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col className="d-flex">
                                      <p className="m-auto">
                                        {moment(created_on)
                                          .tz('Asia/Taipei')
                                          .format('yyyy-MM-DD HH:mm')}
                                      </p>
                                    </Col>
                                    <Col className="d-flex">
                                      <p className="m-auto">
                                        {moment(updated_on)
                                          .tz('Asia/Taipei')
                                          .format('yyyy-MM-DD HH:mm')}
                                      </p>
                                    </Col>
                                    <Col
                                      xs={2}
                                      className="d-flex justify-content-center"
                                    >
                                      <Button
                                        className="w-25 h-50 btn-hover-wom my-auto"
                                        onClick={(e) => {
                                          setEditing(
                                            editing && draft_id === editing
                                              ? ''
                                              : draft_id
                                          )
                                          e.stopPropagation()
                                        }}
                                        title="編 輯"
                                      >
                                        <FontAwesomeIcon
                                          icon={
                                            editing === draft_id
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
                                          setshowWarn(draft_id)
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
                                      <Button
                                        className="w-25 h-50 btn-hover-wom my-auto"
                                        onClick={async (e) => {
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
                                        }}
                                        title="匯出專案"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCloudArrowDown}
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
                                        className="w-25 my-auto fs-5 text-wom"
                                        // onClick={() => handleDraftDelete(draft_id)}
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

            {/* 2 */}
            <Row className="px-3 pt-3 fs-5 fw-bold text-wom">
              你可能會喜歡...
            </Row>
            <DragDropContext
              onDragEnd={(e) => {
                const result = Array.from(drafts)
                const [removed] = result.splice(e.source.index, 1)
                result.splice(e.destination.index, 0, removed)
                setDrafts(result)
              }}
            >
              <Droppable droppableId="droppable" direction="vertical">
                {(dropProvided, dropSnapshot) => (
                  <div
                    {...dropProvided.droppableProps}
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                    className="w-100 h-auto"
                  >
                    {drafts ? (
                      drafts
                        .filter(({ setting }) => {
                          const { name, remark } = setting
                          return (
                            !search ||
                            (name && name.includes(search)) ||
                            (remark && remark.includes(search))
                          )
                        })
                        .map(
                          (
                            { draft_id, setting, created_on, updated_on },
                            i
                          ) => (
                            <Draggable
                              key={`${draft_id}`}
                              draggableId={`${draft_id}`}
                              index={i}
                            >
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  style={{
                                    ...getItemStyle(
                                      dragSnapshot.isDragging,
                                      dragProvided.draggableProps.style
                                    ),
                                    height: '100px',
                                    // className="position-absolute text-wom" fs-7"
                                    // top: `${5}%`,
                                    // left: `${3 + i * 32}%`,
                                    // height: '85%',
                                    // width: '30%',
                                  }}
                                >
                                  <Row
                                    key={draft_id}
                                    className="w-100 h-100 mx-0 p-0 text-wom fw-bold rounded my-1 py-2 text-center"
                                    onClick={() => setDraftId(draft_id)}
                                    style={{
                                      border: '1px solid rgb(99, 35, 35, 0.7)',
                                      backgroundColor: 'rgb(254 215 187 / 11%)',
                                    }}
                                  >
                                    <Col xs={1} className="d-flex">
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        defaultValue={setting.id || draft_id}
                                        // value={setting.name || ''}
                                        onChange={(e) =>
                                          setDraft(
                                            { id: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col
                                      xs={3}
                                      className="d-flex h-100 flex-column"
                                    >
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        defaultValue={
                                          setting.name ||
                                          `專案${setting.id || draft_id}`
                                        }
                                        // value={setting.name || ''}
                                        onChange={(e) =>
                                          setDraft(
                                            { name: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col xs={3} className="d-flex">
                                      <Form.Control
                                        className="my-auto h-75 py-0 fw-regular fs-7 text-wom text-center"
                                        style={{
                                          backgroundColor: 'transparent',
                                          borderColor: 'transparent',
                                          boxShadow:
                                            editing === draft_id
                                              ? '0 0 0 0.2rem inset rgb(202, 198, 230)'
                                              : '',
                                          color: '#0a004e',
                                          fontWeight: '700',
                                        }}
                                        placeholder={
                                          editing === draft_id
                                            ? '編輯備註...'
                                            : ''
                                        }
                                        defaultValue={setting.remark || ''}
                                        // value={setting.name || ''}
                                        onClick={(e) => {
                                          if (editing && editing !== draft_id) {
                                            setEditing(draft_id)
                                          }
                                          e.stopPropagation()
                                        }}
                                        onChange={(e) =>
                                          setDraft(
                                            { remark: e.target.value },
                                            draft_id
                                          )
                                        }
                                      />
                                    </Col>
                                    <Col className="d-flex">
                                      <p className="m-auto">
                                        {moment(created_on)
                                          .tz('Asia/Taipei')
                                          .format('yyyy-MM-DD HH:mm')}
                                      </p>
                                    </Col>
                                    <Col className="d-flex">
                                      <p className="m-auto">
                                        {moment(updated_on)
                                          .tz('Asia/Taipei')
                                          .format('yyyy-MM-DD HH:mm')}
                                      </p>
                                    </Col>
                                    <Col
                                      xs={2}
                                      className="d-flex justify-content-center"
                                    >
                                      <Button
                                        className="w-25 h-50 btn-hover-wom my-auto"
                                        onClick={(e) => {
                                          setEditing(
                                            editing && draft_id === editing
                                              ? ''
                                              : draft_id
                                          )
                                          e.stopPropagation()
                                        }}
                                        title="編 輯"
                                      >
                                        <FontAwesomeIcon
                                          icon={
                                            editing === draft_id
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
                                          setshowWarn(draft_id)
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
                                      <Button
                                        className="w-25 h-50 btn-hover-wom my-auto"
                                        onClick={async (e) => {
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
                                        }}
                                        title="匯出專案"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCloudArrowDown}
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
                                        className="w-25 my-auto fs-5 text-wom"
                                        // onClick={() => handleDraftDelete(draft_id)}
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
            if (value) handleDraftDelete(value)
            setshowWarn(false)
          },
        }}
      />
    </Container>
  )
}

Warn.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default Home
