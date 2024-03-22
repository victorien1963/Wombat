/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useContext, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Dropdown, Button, Modal, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckSquare,
  faCirclePlus,
  faEdit,
  faFileImport,
  faImage,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { DraftContext } from './ContextProvider'
import ImgWithFunc from './ImgWithFuncs'
import VideoWithFunc from './VideoWithFuncs'
import FloatInput from './FloatInput'

const colors = [
  '1px solid rgb(35, 61, 99, 0.7)',
  '1px solid rgb(51, 107, 139, 0.7)',
  '1px solid rgb(234, 112, 11, 0.7)',
  '1px solid rgb(240, 181, 31, 0.7)',
  '1px solid rgb(131, 152, 77, 0.7)',
]

const bgcolors = [
  'rgb(35, 61, 99, 0.1)',
  'rgb(51, 107, 139, 0.1)',
  'rgb(234, 112, 11, 0.1)',
  'rgb(240, 181, 31, 0.1)',
  'rgb(131, 152, 77, 0.1)',
]

function ColorForm({ setting }) {
  const {
    module = [],
    index,
    handleInputChange,
    handleInsertDelete,
    onChange,
    checked,
    hasSerial = false,
  } = setting
  const [
    name = '- -',
    advance = [],
    weak = [],
    price = '- -',
    sp = '- -',
    audience = '- -',
    pr = 0,
    pa = 0,
    i,
  ] = module

  return (
    <Row
      className="w-100 mx-0 my-1 p-0 text-dai fw-bold rounded"
      style={{
        height: '5vh',
        border: colors[(i !== undefined ? i : index) % 5],
        backgroundColor: bgcolors[(i !== undefined ? i : index) % 5],
      }}
    >
      {onChange && (
        <div className="d-flex" style={{ width: '5%' }}>
          <Form.Check
            className="my-auto"
            onChange={onChange}
            checked={checked}
          />
        </div>
      )}
      {hasSerial && (
        <div className="d-flex" style={{ width: '10%' }}>
          <p className="m-auto">{(i || index) + 1}</p>
        </div>
      )}
      <div className="d-flex" style={{ width: '15%' }}>
        <Form.Control
          className="my-auto py-0 fw-regular fs-7 text-dai text-center"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          value={name}
          onChange={(e) =>
            handleInputChange('inserts', index, [
              e.target.value,
              advance,
              weak,
              price,
              sp,
              audience,
              pr,
              pa,
              i,
            ])
          }
        />
      </div>
      <Col xs={2} className="d-flex px-1 flex-fill">
        <Form.Control
          className="my-auto py-0 fw-regular fs-7 text-dai"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          value={price}
          onChange={(e) =>
            handleInputChange('inserts', index, [
              name,
              advance,
              weak,
              e.target.value,
              sp,
              audience,
              pr,
              pa,
              i,
            ])
          }
        />
      </Col>
      <Col xs={2} className="d-flex px-1 flex-fill">
        <Form.Control
          className="my-auto py-0 fw-regular fs-7 text-dai"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          value={sp}
          onChange={(e) =>
            handleInputChange('inserts', index, [
              name,
              advance,
              weak,
              price,
              e.target.value,
              audience,
              pr,
              pa,
              i,
            ])
          }
        />
      </Col>
      <Col xs={2} className="d-flex px-1 flex-fill">
        <Form.Control
          className="my-auto py-0 fw-regular fs-7 text-dai"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          value={audience}
          onChange={(e) =>
            handleInputChange('inserts', index, [
              name,
              advance,
              weak,
              price,
              sp,
              e.target.value,
              pr,
              pa,
              i,
            ])
          }
        />
      </Col>
      {handleInsertDelete && (
        <Col xs={2} className="d-flex px-0">
          <div className="w-50 h-100 d-flex ms-auto">
            <FontAwesomeIcon
              className="m-auto"
              style={{
                cursor: 'pointer',
              }}
              icon={faTimes}
              title="刪 除"
              onClick={() => {
                handleInsertDelete(index)
              }}
            />
          </div>
        </Col>
      )}
    </Row>
  )
}

function Insert({ setting }) {
  const {
    index,
    type,
    value,
    colorIndex,
    handleInputChange,
    handleInsertChange,
    handleInsertDelete,
  } = setting
  const [editing, setEditing] = useState(false)

  switch (type) {
    case 'textarea':
      return (
        <Row
          className="w-100 mx-0 p-0 text-dai fw-bold rounded my-1"
          style={{
            minHeight: '125px',
            maxHeight: '125px',
            border: colors[colorIndex],
            backgroundColor: bgcolors[colorIndex],
          }}
        >
          <Col xs={10} className="p-0 flex-grow-1">
            {editing ? (
              <Form.Control
                className="h-100"
                style={{
                  fontSize: '0.93rem',
                  backgroundColor: 'transparent',
                }}
                placeholder="文字框"
                as="textarea"
                value={value}
                onChange={(e) =>
                  handleInsertChange(index, {
                    type,
                    value: e.target.value,
                  })
                }
              />
            ) : (
              <div className="h-100 w-100 d-flex ps-3">
                <p className="text-start my-auto">{value || '文字框'}</p>
              </div>
            )}
          </Col>
          <Col xs={1} className="d-flex px-0 flex-grow-1">
            <div className="w-50 d-flex">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                title="編 輯"
                onClick={() => {
                  setEditing(!editing)
                }}
                icon={editing ? faCheckSquare : faEdit}
              />
            </div>
            <div className="w-50 h-100 d-flex">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                icon={faTimes}
                title="刪 除"
                onClick={() => {
                  handleInsertDelete(index)
                }}
              />
            </div>
          </Col>
        </Row>
      )
    case 'image':
      return (
        <Row
          className="w-100 h-100 flex-fill mx-0 p-0 text-dai fw-bold rounded my-1"
          style={{
            minHeight: '125px',
            maxHeight: '125px',
            border: colors[colorIndex],
            backgroundColor: bgcolors[colorIndex],
          }}
        >
          <Col xs={10} className="p-0 h-100 d-flex">
            <ImgWithFunc
              setting={{
                id: `insert_${index}`,
                scale: '100%',
                src: value,
                handlePicSelect: () => {},
                handlePicChange: (path) => {
                  handleInsertChange(index, {
                    type,
                    value: path,
                  })
                },
                maxHeight: '123px',
              }}
            />
          </Col>
          <Col xs={1} className="d-flex px-0 ms-auto">
            <div className="w-100 h-100 d-flex ms-auto">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                icon={faTimes}
                title="刪 除"
                onClick={() => {
                  handleInsertDelete(index)
                }}
              />
            </div>
          </Col>
        </Row>
      )
    case 'video':
      return (
        <Row
          className="w-100 mx-0 p-0 text-dai fw-bold rounded my-1"
          style={{
            minHeight: '125px',
            maxHeight: '125px',
            border: colors[colorIndex],
            backgroundColor: bgcolors[colorIndex],
          }}
        >
          <Col xs={10} className="p-0 h-100">
            <VideoWithFunc
              setting={{
                id: `insert_${index}`,
                scale: '100%',
                src: value,
                handlePicSelect: () => {},
                handlePicChange: (path) => {
                  handleInsertChange(index, {
                    type,
                    value: path,
                  })
                },
                maxHeight: '123px',
              }}
            />
          </Col>
          <Col xs={2} className="d-flex px-0 ms-auto">
            <div className="w-50 h-100 d-flex ms-auto">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                icon={faTimes}
                title="刪 除"
                onClick={() => {
                  handleInsertDelete(index)
                }}
              />
            </div>
          </Col>
        </Row>
      )
    case 'html':
      return (
        <Row
          className="w-100 mx-0 p-0 text-dai fw-bold rounded my-1"
          style={{
            minHeight: '125px',
            maxHeight: '125px',
            border: colors[colorIndex],
            backgroundColor: bgcolors[colorIndex],
          }}
        >
          <Col xs={10} className="p-0 h-100 flex-grow-1">
            {editing ? (
              <Form.Control
                className="h-100"
                style={{
                  fontSize: '0.93rem',
                  backgroundColor: 'transparent',
                }}
                placeholder="鑲入碼"
                as="textarea"
                value={value}
                onChange={(e) =>
                  handleInsertChange(index, {
                    type,
                    value: e.target.value,
                  })
                }
              />
            ) : (
              <div className="h-75 w-100 d-flex ps-3">
                <iframe
                  style={{
                    maxHeight: '100%',
                  }}
                  srcDoc={value || '<p>鑲入碼</p>'}
                  title={`insert_${index}`}
                />
              </div>
            )}
          </Col>
          <Col xs={1} className="d-flex h-100 px-0 flex-grow-1">
            <div className="w-50 d-flex">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                title="編 輯"
                onClick={() => {
                  setEditing(!editing)
                }}
                icon={editing ? faCheckSquare : faEdit}
              />
            </div>
            <div className="w-50 h-100 d-flex">
              <FontAwesomeIcon
                className="m-auto"
                style={{
                  cursor: 'pointer',
                }}
                icon={faTimes}
                title="刪 除"
                onClick={() => {
                  handleInsertDelete(index)
                }}
              />
            </div>
          </Col>
        </Row>
      )
    default:
      return (
        <Row
          className="w-100 h-50 flex-fill mx-0 p-0 text-dai fw-bold rounded my-1"
          // style={{
          //   border: colors[index % 5],
          //   backgroundColor: bgcolors[index % 5],
          // }}
        >
          <ColorForm
            setting={{
              module: value,
              index,
              handleInputChange,
              handleInsertDelete,
              hasSerial: false,
            }}
          />
        </Row>
      )
  }
}

function ColorCard({ setting }) {
  const {
    page = 2,
    inserts,
    handleInputChange,
    handleInsertChange,
    handleInsertDelete,
    handleInsertResort,
  } = setting

  // const [showWarn, setshowWarn] = useState({
  //   show: false,
  //   func: () => {},
  // })

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    const startIndex =
      result.source.index + parseInt(result.source.droppableId, 10) * page
    const endIndex =
      result.destination.index +
      parseInt(result.destination.droppableId, 10) * page
    handleInsertResort(
      'inserts',
      inserts[startIndex].index,
      inserts[endIndex].index
    )
  }
  const grid = 0
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    minWidth: isDragging ? '' : '32%',
    ...draggableStyle,
  })

  const lists = useMemo(() => {
    if (!inserts) return [[]]
    const res = []
    if (page === 1) {
      res.push(inserts)
      return res
    }
    const fill = inserts.length % page ? page - (inserts.length % page) : 0
    const filled = inserts.concat(
      Array.from({ length: fill }).fill({ type: 'fill' })
    )
    for (let i = 0; i < filled.length; i += page)
      res.push(
        filled
          .slice(i, i + page)
          .map((r) => (r.type ? r : { type: 'default', value: r }))
      )

    return res
  }, [inserts])

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    padding: grid,
    width: '100%',
  })
  return (
    <Card
      className="w-100 p-0 text-dai fw-bold border-0"
      style={{
        backgroundColor: 'transparent',
        minHeight: '200px',
        maxHeight: '200px',
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, i) => (
          <Droppable
            key={i}
            droppableId={`${i}`}
            direction={page === 1 ? 'vertical' : 'horizontal'}
          >
            {(dropProvided, dropSnapshot) => (
              <div
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                style={getListStyle(dropSnapshot.isDraggingOver)}
                className={`w-100 d-flex flex-nowrap ${
                  page === 1 ? 'flex-column' : ''
                }`}
              >
                {list.map(
                  ({ type, value, colorIndex, index }, id) =>
                    type !== 'fill' && (
                      <Draggable
                        key={`${i}_${id}`}
                        draggableId={`${i}_${id}`}
                        index={id}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="text-dai fs-7 px-2 d-flex flex-column flex-grow-1 me-auto"
                            style={{
                              borderRadius: '0.375rem',
                              minHeight: page === 1 ? '7vh' : '130px',
                              maxHeight: page === 1 ? '7vh' : '130px',
                              height: page === 1 ? '7vh' : '130px',
                              minWidth: `${99 / page}%`,
                              maxWidth: `${99 / page}%`,
                              width: `${99 / page}%`,
                              ...getItemStyle(
                                dragSnapshot.isDragging,
                                dragProvided.draggableProps.style
                              ),
                            }}
                          >
                            <Insert
                              key={index}
                              setting={{
                                index,
                                type,
                                value,
                                colorIndex,
                                handleInputChange,
                                handleInsertChange,
                                handleInsertDelete,
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                )}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Card>
  )
}

function Module2Modal({ setting }) {
  const { show, module, handleClose } = setting
  const { module2 } = useContext(DraftContext)
  const { product } = module2

  const [selected, setSelected] = useState(
    module.product && module.product[0]
      ? module.product[0].map((p) => p[8])
      : []
  )

  return (
    <Modal show={show} onHide={() => handleClose()} size="lg">
      <Modal.Header closeButton>數據資料</Modal.Header>
      <Modal.Body>
        <Col className="h-100 w-100 pt-2 d-flex flex-column">
          <Row
            className="px-3"
            style={{
              backgroundColor: 'white',
            }}
          >
            <div style={{ width: '10%' }}>序號</div>
            <div style={{ width: '15%' }}>品牌名稱</div>
            <Col xs={2} className="flex-fill">
              價格區間
            </Col>
            <Col xs={2} className="flex-fill">
              產品特點
            </Col>
            <Col xs={2} className="flex-fill">
              主要客群
            </Col>
          </Row>
          {product && product.map
            ? product.map((m, index) => (
                <ColorForm
                  key={index}
                  setting={{
                    module: m,
                    index,
                    handleInputChange: () => {},
                    onChange: () =>
                      setSelected((prevState) =>
                        prevState.includes(index)
                          ? prevState.filter((ps) => ps !== index)
                          : [...prevState, index]
                      ),
                    checked: selected.includes(index),
                    hasSerial: true,
                  }}
                />
              ))
            : [1, 2, 3, 4, 5].map((key, index) => (
                <ColorForm
                  key={index}
                  setting={{
                    module: [],
                    index,
                    handleInputChange: () => {},
                  }}
                />
              ))}
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          取消
        </Button>
        <Button
          variant="outline-dai"
          onClick={() =>
            handleClose(selected.map((index) => [...product[index], index]))
          }
        >
          確定
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function SuggestPersona({ setting }) {
  const {
    module,
    handleInputChange,
    handlePicChange,
    handlePicSelect,
    handleInsert = () => {},
    handleInsertChange = () => {},
    handleInsertDelete = () => {},
    handleInsertResort = () => {},
  } = setting
  const { persona = [], pics = [], picSelect, inserts = [] } = module

  const [show, setShow] = useState(false)
  const handleClose = (products) => {
    if (products) handleInsert('inserts', products)
    setShow(false)
  }

  // const onDragEnd = (result) => {
  //   if (!result.destination) {
  //     return
  //   }
  //   handleInsertResort('inserts', result.source.index, result.destination.index)
  // }

  // const getItemStyle = (isDragging, draggableStyle) => ({
  //   userSelect: 'none',
  //   minWidth: isDragging ? '' : '100%',
  //   width: isDragging ? '' : '100%',
  //   height: '25%',
  //   ...draggableStyle,
  // })

  // const getListStyle = (isDraggingOver) => ({
  //   background: isDraggingOver ? 'transparent' : 'transparent',
  //   width: '100%',
  // })
  const [floatSetting, setfloatSetting] = useState({
    visibility: 'hidden',
    top: '0px',
    left: '0px',
    width: '0px',
    value: '',
    onBlur: () => {},
    onChange: () => {},
  })

  return (
    <div className="w-100 h-100 rounded text-dai px-4 overflow-scroll">
      <Row
        className="w-100 h-100 rounded-top border-bottom-0 text-dai overflow-hidden"
        style={{
          border: '1px solid rgb(35, 61, 99, 0.7)',
        }}
      >
        <Col xs={4} className="h-100 d-flex flex-column ps-2 pe-3 rounded">
          <Row
            className="px-3 py-3"
            style={{
              hieght: '65%',
              minHeight: '65%',
              maxHeight: '65%',
              backgroundColor: bgcolors[0],
            }}
          >
            <div
              className="d-flex h-100 flex-wrap px-0"
              style={{
                border: '1px dashed rgb(35, 61, 99, 0.7)',
                borderRadius: '5px',
                maxHeight: '100%',
              }}
            >
              {pics.length > 0 ? (
                pics.map((src, i) => {
                  const scale =
                    i === picSelect
                      ? '100%'
                      : picSelect !== undefined
                      ? '0%'
                      : '50%'
                  return (
                    <ImgWithFunc
                      setting={{
                        id: i,
                        scale,
                        src,
                        handlePicSelect: () => handlePicSelect(i),
                        handlePicChange: (path) => {
                          handlePicChange(i, path)
                        },
                      }}
                    />
                  )
                })
              ) : (
                <FontAwesomeIcon
                  icon={faImage}
                  className="text-dai-lighter h-25 m-auto"
                />
              )}
              {/* <Image /> */}
            </div>
          </Row>
          <Row
            className="px-3 pt-1"
            style={{
              hieght: '10%',
              minHeight: '10%',
              maxHeight: '10%',
              backgroundColor: bgcolors[0],
            }}
          >
            <Col
              className="h-100 d-flex px-0 rounded"
              style={{
                border: '1px dashed rgb(35, 61, 99, 0.7)',
              }}
            >
              <Form.Control
                rows={1}
                style={{
                  height: '100%',
                  fontSize: '0.93rem',
                  backgroundColor: 'transparent',
                }}
                placeholder="姓名"
                as="textarea"
                value={persona[0]}
                onChange={(e) =>
                  handleInputChange('persona', 0, [e.target.value])
                }
              />
            </Col>
            {/* <p className="m-auto">使用者名稱: {auth.name}</p> */}
          </Row>

          <Row
            className="flex-fill px-3 pt-1 pb-2"
            style={{
              hieght: '25%',
              minHeight: '25%',
              maxHeight: '25%',
              backgroundColor: bgcolors[0],
            }}
          >
            <Col
              className="h-100 d-flex px-0 rounded"
              style={{
                border: '1px dashed rgb(35, 61, 99, 0.7)',
              }}
            >
              <Form.Control
                // rows={6}
                style={{
                  height: '100%',
                  fontSize: '0.93rem',
                  backgroundColor: 'transparent',
                }}
                placeholder="個人資料：（姓名、性別、年齡、住址、婚姻狀況、座右銘、個性、生活目標與需求 ）"
                as="textarea"
                value={persona[1]}
                onChange={(e) =>
                  handleInputChange('persona', 1, [e.target.value])
                }
              />
            </Col>
          </Row>
        </Col>
        <Col
          xs={8}
          className="h-100 d-flex flex-column px-2"
          // style={{ overflowY: 'auto' }}
        >
          <Row
            className="p-3"
            style={{
              backgroundColor: bgcolors[4],
              minHeight: '20%',
              maxHeight: '20%',
            }}
          >
            <Form.Control
              // rows={6}
              style={{
                height: '100%',
                fontSize: '0.93rem',
                backgroundColor: 'transparent',
              }}
              placeholder="第一人稱介紹"
              as="textarea"
              value={persona[12]}
              onChange={(e) =>
                handleInputChange('persona', 12, [e.target.value])
              }
            />
          </Row>
          <Row
            className="flex-fill py-3 h-20 position-relative"
            style={{
              backgroundColor: bgcolors[2],
              minHeight: '80%',
              maxHeight: '80%',
            }}
          >
            {persona.slice(2, 12).map((p, i) => (
              <div key={i} className="d-flex">
                <p className="w-10 my-auto">{i + 1}.</p>
                <Form.Control
                  className="my-auto py-0 fw-regular fs-7 text-dai"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  value={p}
                  onChange={(e) =>
                    handleInputChange('persona', i + 2, [e.target.value])
                  }
                  onDoubleClick={(e) => {
                    const { offsetTop, offsetLeft, offsetWidth } = e.target
                    setfloatSetting({
                      top: offsetTop,
                      left: offsetLeft,
                      width: offsetWidth,
                      visibility: 'visible',
                      value: p,
                      onBlur: () =>
                        setfloatSetting({
                          ...floatSetting,
                          visibility: 'hidden',
                        }),
                      onChange: (value) => {
                        handleInputChange('persona', i + 2, [value])
                      },
                    })
                  }}
                />
              </div>
            ))}
            <FloatInput setting={floatSetting} />
          </Row>
        </Col>
      </Row>
      <Row
        className="w-100 h-60 border-bottom-0 border-top-0 text-dai d-flex flex-column"
        style={{
          border: '1px solid rgb(35, 61, 99, 0.7)',
          overflowY: 'auto',
        }}
      >
        <div
          className="d-flex flex-fill px-3 py-2"
          style={{
            backgroundColor: bgcolors[4],
            height: '50%',
            minHeight: '50%',
            maxHeight: '50%',
          }}
        >
          <Col xs={6} className="text-start pt-2 fs-5 fw-bold ps-1">
            資料數據
          </Col>
          <Col xs={6} className="text-end pt-2 pe-0 d-flex">
            <Button
              onClick={() => setShow(true)}
              className="mb-auto ms-auto h-100"
              variant="outline-dai"
              size="sm"
            >
              帶入競品分析資料 <FontAwesomeIcon icon={faFileImport} />
            </Button>
          </Col>
        </div>
        <div
          className="d-flex flex-fill px-3 pb-3 h-25 overflow-scroll"
          style={{
            backgroundColor: bgcolors[4],
            height: '40%',
            minHeight: '40%',
            maxHeight: '40%',
          }}
        >
          <ColorCard
            setting={{
              page: 1,
              inserts: inserts
                .map((item, index) =>
                  item.type ? item : { type: 'default', value: item, index }
                )
                .filter(({ type }) => type === 'default'),
              handleInputChange,
              handleInsertChange,
              handleInsertResort,
              handleInsertDelete,
            }}
          />
        </div>
      </Row>
      <Row
        className="w-100 h-60 rounded-bottom border-top-0 text-dai d-flex flex-column"
        style={{
          border: '1px solid rgb(35, 61, 99, 0.7)',
          overflowY: 'auto',
        }}
      >
        <div
          className="d-flex flex-fill px-3 py-2"
          style={{
            backgroundColor: bgcolors[3],
            height: '50%',
            minHeight: '50%',
            maxHeight: '50%',
          }}
        >
          <Col xs={12} className="text-end pt-2 pe-0 d-flex">
            <Dropdown className="my-auto ms-auto px-0">
              <Dropdown.Toggle
                className="btn-outline-lucaLight fs-7 w-100 h-100"
                id="dropdown-basic"
                variant="outline-dai"
                size="sm"
              >
                新增版位 <FontAwesomeIcon icon={faCirclePlus} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="px-3">
                {[
                  {
                    label: '文字框',
                    onClick: () => {
                      handleInsert('inserts', [
                        {
                          type: 'textarea',
                          value: '',
                          colorIndex: inserts.length % 5,
                        },
                      ])
                    },
                  },
                  {
                    label: '圖片',
                    onClick: () => {
                      handleInsert('inserts', [
                        {
                          type: 'image',
                          value: '',
                          colorIndex: inserts.length % 5,
                        },
                      ])
                    },
                  },
                  {
                    label: '影音',
                    onClick: () => {
                      handleInsert('inserts', [
                        {
                          type: 'video',
                          value: '',
                          colorIndex: inserts.length % 5,
                        },
                      ])
                    },
                  },
                  {
                    label: '嵌入碼',
                    onClick: () => {
                      handleInsert('inserts', [
                        {
                          type: 'html',
                          value: '',
                          colorIndex: inserts.length % 5,
                        },
                      ])
                    },
                  },
                ].map(({ label, onClick }) => (
                  <Dropdown.Item onClick={onClick}>{label}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </div>
        <div
          className="d-flex flex-fill px-3 pb-3 h-25 overflow-scroll"
          style={{
            backgroundColor: bgcolors[3],
            height: '40%',
            minHeight: '40%',
            maxHeight: '40%',
          }}
        >
          <ColorCard
            setting={{
              inserts: inserts
                .map((item, index) => ({ ...item, index }))
                .filter(({ type }) => type),
              handleInputChange,
              handleInsertChange,
              handleInsertResort,
              handleInsertDelete,
            }}
          />
        </div>
      </Row>
      <Module2Modal
        setting={{
          show,
          handleClose,
          module,
        }}
      />
    </div>
  )
}

Insert.propTypes = {
  setting: PropTypes.shape().isRequired,
}

ColorCard.propTypes = {
  setting: PropTypes.shape().isRequired,
}

ColorForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

Module2Modal.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestPersona.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestPersona
