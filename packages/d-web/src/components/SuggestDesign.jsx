/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
    handleInputChange = () => {},
    handleCardAdd = () => {},
    handleCardDelete = () => {},
    handleCardResort = () => {},
  } = setting
  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    handleCardResort('design', result.source.index, result.destination.index)
  }
  const grid = 8
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    minWidth: isDragging ? '' : '100%',
    width: isDragging ? '' : '100%',
    height: '25%',

    // change background colour if dragging
    // background: isDragging ? 'white' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    padding: grid,
    width: '100%',
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(dropProvided, dropSnapshot) => (
          <div
            className="w-100 h-100 d-flex"
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
            style={{
              flexWrap: 'wrap',
              ...getListStyle(dropSnapshot.isDraggingOver),
            }}
          >
            {module.map(([tag, content, id], i) => (
              <Draggable key={`${id}`} draggableId={`${id}`} index={i}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className="text-dai fs-7 p-2 d-flex mx-1 flex-column"
                    style={{
                      background: bgcolors[id % 5],
                      border: '1px solid #ced4da',
                      borderRadius: '0.375rem',
                      ...getItemStyle(
                        dragSnapshot.isDragging,
                        dragProvided.draggableProps.style
                      ),
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
                      <Col xs={3} className="d-flex">
                        <p className="w-10 my-auto">{i + 1}.</p>
                        <Form.Control
                          className="my-auto py-0 fw-regular fs-7 text-dai"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                          }}
                          value={tag}
                          onChange={(e) =>
                            handleInputChange('design', i, [
                              e.target.value,
                              content,
                              id,
                            ])
                          }
                        />
                      </Col>
                      <Col className="d-flex h-100 flex-column">
                        <Form.Control
                          className="my-auto py-0 fw-regular fs-7 text-dai"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                          }}
                          as="textarea"
                          rows={5}
                          value={content}
                          onChange={(e) =>
                            handleInputChange('design', i, [
                              tag,
                              e.target.value,
                              id,
                            ])
                          }
                        />
                      </Col>
                      <div
                        style={{
                          width: '20px',
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{
                            cursor: 'pointer',
                          }}
                          className="ms-auto mb-auto fs-7 text-dai-light"
                          onClick={() => handleCardDelete('design', i)}
                          title="刪除"
                        />
                      </div>
                    </Row>
                  </div>
                )}
              </Draggable>
            ))}
            <div
              className="text-dai fs-7 p-2 d-flex mx-1 flex-column"
              style={{
                background: 'rgba(35, 61, 99, 0.1)',
                border: '1px solid #ced4da',
                borderRadius: '0.375rem',
                width: '100%',
              }}
            >
              <FontAwesomeIcon
                icon={faCirclePlus}
                style={{
                  cursor: 'pointer',
                }}
                className="m-auto fs-2 text-dai-lighter"
                onClick={() => handleCardAdd('design')}
                title="新增"
              />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function ColorCard({ setting }) {
  const {
    module = [],
    handleInputChange = () => {},
    handleCardAdd = () => {},
    handleCardDelete = () => {},
    handleCardResort = () => {},
  } = setting
  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    handleCardResort(
      'design',
      result.source.index + parseInt(result.source.droppableId, 10) * 5,
      result.destination.index +
        parseInt(result.destination.droppableId, 10) * 5
    )
  }
  const grid = 8
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    minWidth: isDragging ? '' : '19%',
    width: isDragging ? '' : '19%',
    height: '100%',

    // change background colour if dragging
    // background: isDragging ? 'white' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    padding: grid,
    width: '100%',
  })

  const lists = useMemo(() => {
    if (!module) return [[]]
    const fill = module.length % 5 ? 5 - (module.length % 5) : 0
    const res = []
    const filled = module.concat(
      fill
        ? Array.from({ length: fill - 1 })
            .fill([{ fill: true }, false, false])
            .concat([[{ plus: true }, false, false]])
        : [[{ plus: true }, false, false]]
    )
    for (let i = 0; i < filled.length; i += 5) res.push(filled.slice(i, i + 5))
    return res
  }, [module])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {lists.map((list, index) => (
        <Droppable key={index} droppableId={`${index}`} direction="horizontal">
          {(dropProvided, dropSnapshot) => (
            <div
              className="w-100 d-flex"
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
              style={{
                flexWrap: 'wrap',
                minHeight: '50%',
                height: '50%',
                ...getListStyle(dropSnapshot.isDraggingOver),
              }}
            >
              {list.map(([tag, content, id], i) =>
                tag.plus ? (
                  <div
                    className="text-dai fs-7 p-2 d-flex mx-1 mb-2 flex-column"
                    style={{
                      background: 'rgba(35, 61, 99, 0.1)',
                      border: '1px solid #ced4da',
                      borderRadius: '0.375rem',
                      width: '19%',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      style={{
                        cursor: 'pointer',
                      }}
                      className="m-auto fs-2 text-dai-lighter"
                      onClick={() => handleCardAdd('design')}
                      title="新增"
                    />
                  </div>
                ) : (
                  !tag.fill && (
                    <Draggable key={`${id}`} draggableId={`${id}`} index={i}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="text-dai fs-7 p-2 d-flex mx-1 flex-column"
                          style={{
                            background: bgcolors[id % 5],
                            border: '1px solid #ced4da',
                            borderRadius: '0.375rem',
                            ...getItemStyle(
                              dragSnapshot.isDragging,
                              dragProvided.draggableProps.style
                            ),
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
                                  cursor: 'ew-resize',
                                }}
                                value={tag}
                                onChange={(e) =>
                                  handleInputChange('design', index * 5 + i, [
                                    e.target.value,
                                    content,
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
                                  handleCardDelete('design', index * 5 + i)
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
                              handleInputChange('design', index * 5 + i, [
                                tag,
                                e.target.value,
                                id,
                              ])
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                )
              )}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  )
}

function SuggestDesign({ setting }) {
  const {
    tab,
    module = [],
    handleInputChange = () => {},
    handleCardAdd = () => {},
    handleCardDelete = () => {},
    handleCardResort = () => {},
  } = setting

  return (
    <Col className="h-100 w-100 pt-2 d-flex flex-column overflow-hidden">
      <div
        className="flex-fill"
        style={{
          overflowY: 'scroll',
        }}
      >
        {tab.split('_')[1] === '列表模式' ? (
          <ColorForm
            setting={{
              module,
              handleInputChange,
              handleCardAdd,
              handleCardDelete,
              handleCardResort,
            }}
          />
        ) : (
          <ColorCard
            setting={{
              module,
              handleInputChange,
              handleCardAdd,
              handleCardDelete,
              handleCardResort,
            }}
          />
        )}
      </div>
    </Col>
  )
}

ColorForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

ColorCard.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestDesign.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestDesign
