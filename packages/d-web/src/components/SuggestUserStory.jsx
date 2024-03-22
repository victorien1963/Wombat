/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faImage } from '@fortawesome/free-solid-svg-icons'
import * as allCurves from '@visx/curve'
import { GridRows, GridColumns } from '@visx/grid'
import { Bar, LinePath } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear, scalePoint } from '@visx/scale'
import { Drag } from '@visx/drag'
import ImgWithFunc from './ImgWithFuncs'

const bgcolors = [
  'rgb(35, 61, 99, 0.1)',
  'rgb(51, 107, 139, 0.1)',
  'rgb(234, 112, 11, 0.1)',
  'rgb(240, 181, 31, 0.1)',
  'rgb(131, 152, 77, 0.1)',
]

const verticalMargin = 0

// accessors
const getLetter = (d) => d.event
const getLetterFrequency = (d) => Number(d.emotion)

function XYDrag({ setting }) {
  const { emotions, handleEmotionChange, width = 1000, height = 1000 } = setting
  // bounds
  const xMax = width
  const yMax = height - verticalMargin

  const [data, setData] = useState([
    {
      emotion: parseFloat(emotions[0]),
      event: 1,
    },
    {
      emotion: parseFloat(emotions[1]),
      event: 3,
    },
    {
      emotion: parseFloat(emotions[2]),
      event: 5,
    },
    {
      emotion: parseFloat(emotions[3]),
      event: 7,
    },
    {
      emotion: parseFloat(emotions[4]),
      event: 9,
    },
  ])
  useEffect(() => {
    setData([
      {
        emotion: parseFloat(emotions[0]),
        event: 1,
      },
      {
        emotion: parseFloat(emotions[1]),
        event: 3,
      },
      {
        emotion: parseFloat(emotions[2]),
        event: 5,
      },
      {
        emotion: parseFloat(emotions[3]),
        event: 7,
      },
      {
        emotion: parseFloat(emotions[4]),
        event: 9,
      },
    ])
  }, [emotions])

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        padding: 0.8,
      }),
    [xMax]
  )
  const lineXScale = useMemo(
    () =>
      scalePoint({
        range: [0, xMax],
        round: true,
        domain: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        padding: 0.86,
      }),
    [xMax]
  )
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [-4, 4],
      }),
    [yMax]
  )

  const [draggingItems, setDraggingItems] = useState(
    data.map(({ event, emotion }, i) => ({
      id: i,
      x: event * 100,
      y: emotion,
      radius: 12,
      color: 'transparent',
    }))
  )
  useEffect(() => {
    console.log('this is triggered')
    setDraggingItems(
      data.map(({ event, emotion }) => {
        const x = xScale(event) + xScale.bandwidth() / 2
        const refined = Number.isFinite(parseInt(emotion, 10))
          ? Math.max(Math.min(parseInt(emotion, 10), 2), -2)
          : 0
        const y = height - (height / 8) * (refined + 4)
        return {
          event,
          id: event,
          x,
          y,
          radius: 12,
          color: 'transparent',
        }
      })
    )
  }, [data, width])

  const [isDragging, setIsDragging] = useState(false)
  const [isHover, setIsHover] = useState(false)

  return width < 10 ? null : (
    <svg width={width} height={height}>
      {/* <GradientTealBlue id="teal" /> */}
      <rect width={width} height={height} fill="url(#teal)" rx={0} />
      <GridRows
        scale={yScale}
        width={xMax}
        height={yMax}
        numTicks={4}
        stroke="#eeeeee"
      />
      <GridColumns
        scale={xScale}
        width={xMax}
        height={yMax}
        numTicks={5}
        stroke="#eeeeee"
      />
      <Group top={verticalMargin / 2} width={width}>
        {data.map((d) => {
          const letter = getLetter(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getLetterFrequency(d)) ?? 0)
          const barX = xScale(letter)
          const barY = yMax - barHeight
          return (
            <Bar
              key={`bar-${letter}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 233, 217, .5)"
            />
          )
        })}
        <LinePath
          curve={allCurves.curveLinear}
          data={data}
          x={(d) => lineXScale(getLetter(d))}
          y={(d) => yScale(getLetterFrequency(d)) ?? 0}
          stroke="#333"
          strokeWidth={1}
          strokeOpacity={1}
          shapeRendering="geometricPrecision"
          markerMid="url(#marker-circle)"
          markerStart="url(#marker-line)"
          markerEnd="url(#marker-arrow)"
        />
      </Group>
      {draggingItems.map((d) => (
        <Drag
          key={`drag-${d.id}`}
          width={width}
          height={height}
          x={d.x}
          y={d.y}
          onDragStart={() => setIsDragging(d.id)}
          onDragMove={(e) => {
            if (!isDragging) return
            const result = draggingItems
              .map((item) =>
                item.id === d.id ? { ...item, y: item.y + e.dy } : item
              )
              .sort((a, b) => b.id - a.id)
            setData(
              result.map((r) => ({
                emotion: (height - r.y) / (height / 8) - 4,
                event: r.event,
              }))
            )
          }}
          onDragEnd={() => {
            handleEmotionChange(
              data.sort((a, b) => a.event - b.event).map((item) => item.emotion)
            )
            setIsDragging(false)
          }}
        >
          {({ dragStart, dragEnd, dragMove, x, y, dy }) => (
            <React.Fragment key={`dot-${d.id}`}>
              <circle
                cx={x}
                cy={y}
                r={d.radius}
                fill={d.color}
                transform={`translate(0, ${dy})`}
                fillOpacity={1}
                stroke={
                  d.id === isDragging
                    ? '#212529'
                    : d.id === isHover
                    ? '#212529'
                    : 'transparent'
                }
                strokeWidth={2}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseDown={dragStart}
                onMouseEnter={() => setIsHover(d.id)}
                onMouseLeave={() => setIsHover('')}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
                cursor={d.id === isDragging ? 'grabbing' : 'grab'}
              />
            </React.Fragment>
          )}
        </Drag>
      ))}
    </svg>
  )
}

function SuggestUserStory({ setting }) {
  const { module, handleEmotionChange, handleInputChange } = setting

  // svg size
  const ref = useRef(null)
  const [svgSize, setsvgSize] = useState({
    width: 1000,
    height: 500,
  })
  const getSize = () => {
    if (ref.current) {
      const style = getComputedStyle(ref.current)
      const height =
        ref.current.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom)
      const width = ref.current.clientWidth
      return { width, height }
    }
    return false
  }
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const size = getSize()
      if (size.width !== svgSize.width || size.height !== svgSize.height)
        setsvgSize(size)
    })
    observer.observe(ref.current)
    return () => ref.current && observer.unobserve(ref.current)
  }, [])

  const {
    pics = [],
    storys = [],
    events = [],
    contacts = ['', '', '', '', ''],
    ows = ['', '', '', '', ''],
    emotions = [1, 1, 1, 1, 1],
  } = module

  return (
    <div className="h-100 w-100 overflow-scroll text-dai border-table-dai p-3">
      <Row
        className="h-34"
        style={{
          backgroundColor: bgcolors[0],
        }}
      >
        <Col
          className="d-flex p-2 overflow-hidden"
          xs={2}
          style={{
            borderTopLeftRadius: '5px',
            borderBottom: '0px',
            maxHeight: '100%',
          }}
        >
          {pics.length ? (
            <ImgWithFunc
              setting={{
                src: pics[0],
                handlePicSelect: () => {},
                handlePicChange: (path) => handleInputChange('pics', 0, [path]),
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faImage}
              className="text-dai-lighter h-25 m-auto"
            />
          )}
        </Col>
        <Col
          className="h-100 d-flex"
          style={{
            borderTopRightRadius: '5px',
            borderBottom: '0px',
          }}
        >
          <Form.Control
            // rows={6}
            style={{
              height: '100%',
              fontSize: '0.93rem',
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            placeholder="故事內容與描述"
            as="textarea"
            value={storys[0] || ''}
            onChange={(e) => handleInputChange('storys', 0, [e.target.value])}
          />
        </Col>
      </Row>
      <Row
        className="h-5"
        style={{
          backgroundColor: bgcolors[1],
        }}
      >
        <Col
          className="d-flex flex-column h-100"
          style={{
            minHeight: '100%',
            borderBottom: '0px',
            color: 'transparent',
          }}
          xs={2}
        >
          事件點
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'dashed',
          }}
        >
          事件點一
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'dashed',
          }}
        >
          事件點二
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'dashed',
          }}
        >
          事件點三
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'dashed',
          }}
        >
          事件點四
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderBottomWidth: '1.5px',
            borderBottomStyle: 'dashed',
          }}
        >
          事件點五
        </Col>
      </Row>
      <Row
        className="h-40"
        style={{
          backgroundColor: bgcolors[1],
        }}
      >
        <Col
          className="d-flex flex-column h-100 pb-4"
          style={{
            borderTop: '0px',
          }}
          xs={2}
        >
          <span className="m-auto">事件點</span>
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderTop: '0px',
          }}
        >
          <Form.Control
            className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows="auto"
            value={events[0] || ''}
            onChange={(e) => handleInputChange('events', 0, [e.target.value])}
          />
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderTop: 'none',
          }}
        >
          <Form.Control
            className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows="auto"
            value={events[1] || ''}
            onChange={(e) => handleInputChange('events', 1, [e.target.value])}
          />
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderTop: 'none',
          }}
        >
          <Form.Control
            className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows="auto"
            value={events[2] || ''}
            onChange={(e) => handleInputChange('events', 2, [e.target.value])}
          />
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderTop: 'none',
          }}
        >
          <Form.Control
            className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows="auto"
            value={events[3] || ''}
            onChange={(e) => handleInputChange('events', 3, [e.target.value])}
          />
        </Col>
        <Col
          className="d-flex flex-column h-100"
          style={{
            borderTop: 'none',
          }}
        >
          <Form.Control
            className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows="auto"
            value={events[4] || ''}
            onChange={(e) => handleInputChange('events', 4, [e.target.value])}
          />
        </Col>
      </Row>
      <Row
        className="h-25"
        style={{
          backgroundColor: bgcolors[2],
        }}
      >
        <Col
          className="d-flex flex-column h-100 py-5"
          xs={2}
          style={{
            borderTop: '0px',
            borderBottom: '0px',
            borderLeft: '1px solid',
          }}
        >
          <span className="m-auto">使用者的道具需求</span>
          <span className="m-auto">可能接觸到的角色</span>
        </Col>
        {contacts.map((contact, i) => (
          <Col
            className="d-flex h-100"
            style={{
              borderTop: '0px',
              borderBottom: '0px',
            }}
          >
            <Form.Control
              className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              as="textarea"
              rows="auto"
              value={contact || ''}
              onChange={(e) =>
                handleInputChange('contacts', i, [e.target.value])
              }
            />
          </Col>
        ))}
      </Row>
      <Row
        className="h-35 flex-nowrap"
        style={{
          backgroundColor: bgcolors[3],
        }}
      >
        <Col
          className="d-flex h-100"
          xs={2}
          style={{
            borderBottom: '0px',
          }}
        >
          <span className="m-auto">
            使用者情緒&ensp;
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip
                  style={{
                    zIndex: '9999',
                  }}
                >
                  使用者情緒反映使用者在不同階段的感受。低落的情緒點揭示改善體驗的機會；正面情緒則突顯體驗的強處，可供深化和擴展。
                  *註：本報告皆為生成式AI產製，故數據僅提供參考。
                </Tooltip>
              }
            >
              <FontAwesomeIcon className="text-dai" icon={faCircleInfo} />
            </OverlayTrigger>
          </span>
        </Col>
        <Col
          className="h-100 px-0"
          xs={10}
          ref={ref}
          style={{
            borderBottom: '0px',
          }}
        >
          <XYDrag setting={{ emotions, handleEmotionChange, ...svgSize }} />
        </Col>
      </Row>
      <Row
        className="h-40"
        style={{
          backgroundColor: bgcolors[4],
        }}
      >
        <Col
          className="d-flex h-100"
          xs={2}
          style={{
            borderBottomLeftRadius: '5px',
          }}
        >
          <span className="m-auto">痛點與機會點</span>
        </Col>
        {ows.map((ow, i) => (
          <Col className="d-flex h-100">
            <Form.Control
              className="my-auto h-100 py-1 fw-regular fs-7 text-dai"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              as="textarea"
              rows="auto"
              value={ow || ''}
              onChange={(e) => handleInputChange('ows', i, [e.target.value])}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

XYDrag.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestUserStory.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestUserStory
