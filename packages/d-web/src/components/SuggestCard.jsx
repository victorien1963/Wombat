/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faTimes,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { Row, Col, Card, Form, Modal, Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
            <Form.Group className="px-5 lh-md text-center text-dai">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ height: '5rem' }}
                className="my-4"
              />
              <Form.Label className="w-100 fs-5 fw-bold text-center pb-4">
                確定要刪除卡片嗎？
              </Form.Label>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className="sendForm justify-content-center py-3">
        <Button variant="secondary" onClick={() => handleClose(false)}>
          取消
        </Button>
        <Button variant="dai" onClick={() => handleClose(show)}>
          確定
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function ColorCard({ setting }) {
  const {
    label,
    engLabel,
    color,
    bgcolor,
    module = {},
    handleInputChange,
    handleCardAdd,
    handleCardDelete,
    handleCardResort = () => {},
  } = setting

  const [showWarn, setshowWarn] = useState({
    show: false,
    func: () => {},
  })

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    handleCardResort(
      label,
      result.source.index + parseInt(result.source.droppableId, 10) * 3,
      result.destination.index +
        parseInt(result.destination.droppableId, 10) * 3
    )
  }
  const grid = 8
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    minWidth: isDragging ? '' : '32%',

    // change background colour if dragging
    // background: isDragging ? 'white' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const lists = useMemo(() => {
    if (!module[label]) return [[]]
    const fill = module[label].length % 3 ? 3 - (module[label].length % 3) : 0
    const res = []
    const filled = module[label].concat(
      Array.from({ length: fill }).fill([{ fill: true }, false, false, false])
    )
    for (let i = 0; i < filled.length; i += 3) res.push(filled.slice(i, i + 3))
    return res
  }, [module[label]])

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    padding: grid,
    width: '100%',
    height: '270px',
  })
  return (
    <Card
      className="w-100 h-100 p-0 text-dai fw-bold"
      style={{
        border: color,
        backgroundColor: bgcolor,
        minHeight: '100%',
      }}
    >
      <Card.Header className="d-flex">
        <Col xs={2} />
        <Col>
          <span className="text-nowrap">
            {label}（ {engLabel} ）
          </span>
        </Col>
        <Col xs={2}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              cursor: 'pointer',
            }}
            className="ms-auto my-auto fs-7 text-dai-light"
            onClick={() => handleCardAdd(label)}
            title="新增"
          />
        </Col>
      </Card.Header>
      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, index) => (
          <Droppable
            key={index}
            droppableId={`${index}`}
            direction="horizontal"
          >
            {(dropProvided, dropSnapshot) => (
              <div
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                style={getListStyle(dropSnapshot.isDraggingOver)}
                className="w-100 d-flex flex-nowrap"
              >
                {list.map(
                  ([tag, content, memo, id], i) =>
                    !tag.fill && (
                      <Draggable key={`${id}`} draggableId={`${id}`} index={i}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            // style={getItemStyle(
                            //   dragSnapshot.isDragging,
                            //   dragProvided.draggableProps.style
                            // )}
                            className="text-dai fs-7 p-2 d-flex flex-column flex-grow-1 mx-1"
                            style={{
                              background: 'white',
                              border: '1px solid #ced4da',
                              borderRadius: '0.375rem',
                              minHeight: '250px',
                              maxHeight: '250px',
                              minWidth: '32%',
                              maxWidth: '32%',
                              width: '32%',
                              ...getItemStyle(
                                dragSnapshot.isDragging,
                                dragProvided.draggableProps.style
                              ),
                              // className="position-absolute text-dai fs-7"
                              // top: `${5}%`,
                              // left: `${3 + i * 32}%`,
                              // height: '85%',
                              // width: '30%',
                            }}
                          >
                            <Row
                              className="m-0 w-95 d-flex"
                              style={{
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <Col xs={2} />
                              <Col>
                                <Form.Control
                                  className="my-auto py-0 fw-regular fs-7 text-dai text-center"
                                  style={{
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    color: '#0a004e',
                                  }}
                                  value={tag}
                                  onChange={(e) =>
                                    handleInputChange(label, index * 3 + i, [
                                      e.target.value,
                                      content,
                                      memo,
                                      id,
                                    ])
                                  }
                                />
                                {/* {tag} */}
                              </Col>
                              <Col xs={2}>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  style={{
                                    cursor: 'pointer',
                                  }}
                                  className="ms-auto mt-auto fs-7 text-dai-light"
                                  onClick={() =>
                                    setshowWarn({
                                      show: true,
                                      func: () =>
                                        handleCardDelete(label, index * 3 + i),
                                    })
                                  }
                                  title="刪除"
                                />
                              </Col>
                            </Row>
                            <Form.Control
                              // rows={6}
                              style={{
                                height: '100%',
                                fontSize: '0.93rem',
                              }}
                              as="textarea"
                              value={content}
                              onChange={(e) =>
                                handleInputChange(label, index * 3 + i, [
                                  tag,
                                  e.target.value,
                                  memo,
                                  id,
                                ])
                              }
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
      <Warn
        setting={{
          show: showWarn.show,
          handleClose: (value) => {
            if (value) showWarn.func()
            setshowWarn({
              show: false,
              func: () => {},
            })
          },
        }}
      />
    </Card>
  )
}

function SuggestCard({ setting }) {
  return (
    <Row className="w-100 h-100 pt-2 ps-3 overflow-scroll">
      {[
        {
          label: '政治',
          engLabel: 'Political',
          key: 'Political',
          bgcolor: 'rgb(35, 61, 99, 0.1)',
          color: '1px solid rgb(35, 61, 99, 0.7)',
        },
        {
          label: '經濟',
          engLabel: 'Economic',
          key: 'Economic',
          bgcolor: 'rgb(51, 107, 139, 0.1)',
          color: '1px solid rgb(51, 107, 139, 0.7)',
        },
        {
          label: '社會',
          engLabel: 'Social',
          key: 'Social',
          bgcolor: 'rgb(234, 112, 11, 0.1)',
          color: '1px solid rgb(234, 112, 11, 0.7)',
        },
        {
          label: '技術',
          engLabel: 'Technological',
          key: 'Technological',
          bgcolor: 'rgb(240, 181, 31, 0.1)',
          color: '1px solid rgb(240, 181, 31, 0.7)',
        },
        {
          label: '環境',
          engLabel: 'Environmental',
          key: 'Environmental',
          bgcolor: 'rgb(131, 152, 77, 0.1)',
          color: '1px solid rgb(131, 152, 77, 0.7)',
        },
        {
          label: '法律',
          engLabel: 'Legal',
          key: 'Legal',
          bgcolor: 'rgb(66, 63, 63, 0.1)',
          color: '1px solid rgb(66, 63, 63, 0.7)',
        },
      ].map(({ key, label, engLabel, color, bgcolor }) => (
        <Col
          xs={6}
          key={key}
          className="p-1"
          style={{
            minHeight: '270px',
          }}
        >
          <ColorCard
            setting={{
              label,
              engLabel,
              color,
              bgcolor,
              ...setting,
            }}
          />
        </Col>
      ))}
    </Row>
  )
}

ColorCard.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestCard.propTypes = {
  setting: PropTypes.shape().isRequired,
}

Warn.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestCard
