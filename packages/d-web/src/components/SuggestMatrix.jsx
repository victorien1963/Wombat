import React, { useState, useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { scaleLinear } from '@visx/scale'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows, GridColumns } from '@visx/grid'
import { Drag, raise } from '@visx/drag'
import FloatInput from './FloatInput'

const ballcolors = [
  'rgb(35, 61, 99, 0.8)',
  'rgb(51, 107, 139, 0.8)',
  'rgb(234, 112, 11, 0.8)',
  'rgb(240, 181, 31, 0.8)',
  'rgb(131, 152, 77, 0.8)',
]

const bgcolors = [
  'rgb(35, 61, 99, 0.1)',
  'rgb(51, 107, 139, 0.1)',
  'rgb(234, 112, 11, 0.1)',
  'rgb(240, 181, 31, 0.1)',
  'rgb(131, 152, 77, 0.1)',
]

const colors = [
  '1px solid rgb(35, 61, 99, 0.7)',
  '1px solid rgb(51, 107, 139, 0.7)',
  '1px solid rgb(234, 112, 11, 0.7)',
  '1px solid rgb(240, 181, 31, 0.7)',
  '1px solid rgb(131, 152, 77, 0.7)',
]

// const generateCircles = ({ width, height }) => {
//   const radiusRandom = getSeededRandom(0.2)
//   const xRandom = getSeededRandom(0.3)
//   const yRandom = getSeededRandom(0.4)

//   return new Array(width < 360 ? 40 : 185).fill(1).map((d, i) => {
//     const radius = 25 - radiusRandom() * 20
//     return {
//       id: `${i}`,
//       radius,
//       x: Math.round(xRandom() * (width - radius * 2) + radius),
//       y: Math.round(yRandom() * (height - radius * 2) + radius),
//     }
//   })
// }
function tickComponent(props) {
  const { x, y, formattedValue } = props
  return (
    <g x={x} y={y}>
      <Form.Control
        // rows={6}
        style={{
          height: '260px',
          fontSize: '0.93rem',
        }}
        as="textarea"
        defaultValue={formattedValue}
      />
    </g>
  )
}

function XYDrag({ setting }) {
  const {
    width = 0,
    height = '500',
    module = [],
    matrix,
    handleInputChange,
    handleMatrixChange,
  } = setting
  const { name, fields } = matrix
  const margin = { top: 40, right: 60, bottom: 40, left: 200 }

  const toPos = (v) => {
    switch (v) {
      case '小':
        return margin.top + ((height - margin.top - margin.bottom) / 6) * 5
      case '中':
        return margin.top + ((height - margin.top - margin.bottom) / 6) * 3
      case '大':
        return margin.top + (height - margin.top - margin.bottom) / 6
      case '低':
        return (width - margin.left - margin.right) / 6
      case '普':
        return ((width - margin.left - margin.right) / 6) * 3
      case '高':
        return ((width - margin.left - margin.right) / 6) * 5
      default:
        return Number.isFinite(v) ? v : 0
    }
  }

  const currency =
    module &&
    module[0] &&
    module[0][3] &&
    module[0][3].substring(0, module[0][3].match(/[0-9]+/)?.index || 1)

  const [draggingItems, setDraggingItems] = useState([])

  const timeScale = useMemo(() => {
    const array = module.reduce((prev, cur) => {
      if (!cur) return prev
      const [min, max] = cur[3].split('~')[1]
        ? cur[3]
            .split('~')
            .map((c) =>
              parseInt(c.replace(currency, '').replaceAll(',', ''), 10)
            )
        : [
            parseInt(cur[3].replace(currency, '').replaceAll(',', ''), 10),
            parseInt(cur[3].replace(currency, '').replaceAll(',', ''), 10),
          ]
      if (min && max) return [...prev, min, max]
      return prev
    }, [])
    const sorted = Array.from(new Set(array))
      .filter((s) => s && !Number.isNaN(s))
      .sort((a, b) => a - b)

    const getPrice = (p) => {
      try {
        const price = p.split('~')[1]
          ? (parseInt(
              p.split('~')[0].replace(currency, '').replaceAll(',', ''),
              10
            ) +
              parseInt(
                p.split('~')[1].replace(currency, '').replaceAll(',', ''),
                10
              )) /
            2
          : parseInt(p.replace(currency, '').replaceAll(',', ''), 10)
        return price || (sorted[0] + sorted[sorted.length - 1]) / 2
      } catch (e) {
        console.log(e)
        return 0
      }
    }
    setDraggingItems(
      module.map(([id, , , p, , , , y], index) => ({
        id: `${id}_${index}`,
        name: id,
        x: getPrice(p),
        y: toPos(y) || 150 + 60 * index,
        radius: 12,
        color: ballcolors[index % 5],
        index,
      }))
    )
    return scaleLinear({
      domain: [sorted[0] * 0.8 || 0, sorted[sorted.length - 1] * 1.2 || 1000],
    })
  }, [module, width])

  // const timeScale = scaleLinear({
  //   domain: [0, 6],
  // })
  const customScale = scaleLinear({
    domain: [0, 6],
  })

  const gridXScale = scaleLinear({
    domain: [0, 2],
  })
  const gridYScale = scaleLinear({
    domain: [0, 2],
  })
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  timeScale.range([0, xMax])
  customScale.range([yMax, 0])
  gridYScale.range([0, xMax])
  gridXScale.range([yMax, 0])

  if (draggingItems.length === 0 || width < 10) return null

  return (
    <div
      className="Drag h-100 d-flex flex-wrap position-relative"
      style={{ touchAction: 'none' }}
    >
      <div
        className="h-100 d-flex position-absolute"
        style={{
          left: '10px',
          width: '90px',
          paddingTop: '40px',
        }}
      >
        <div
          className="d-flex flex-column"
          style={{
            height: height - margin.top - margin.bottom,
          }}
        >
          <div
            className="my-auto ms-5 w-50 h-25 text-nowrap text-center"
            style={{
              // lineHeight: '0.5rem',
              writingMode: 'vertical-rl',
              textOrientation: 'up',
            }}
            contentEditable
            onChange={(e) =>
              handleMatrixChange({
                name: e.target.value,
                fields,
              })
            }
          >
            {name}
          </div>
          {/* <Form.Control
            className="my-auto ms-2 w-100"
            style={{
              height: '130px',
              // writingMode: 'vertical-lr !important',
              // transform: 'rotate(-90deg)',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
            defaultValue={name}
            onChange={(e) =>
              handleMatrixChange({
                name: e.target.value,
                fields,
              })
            }
          /> */}
        </div>
      </div>
      <div
        className="h-100 d-flex position-absolute"
        style={{
          left: '120px',
          width: '45px',
          paddingTop: '40px',
        }}
      >
        <div
          className="d-flex flex-column"
          style={{
            height: height - margin.top - margin.bottom,
          }}
        >
          <div className="d-flex flex-fill">
            <Form.Control
              className="my-auto w-100"
              style={{
                height: '30px',
              }}
              defaultValue={fields[0]}
              onChange={(e) =>
                handleMatrixChange({
                  name,
                  fields: [e.target.value, fields[1], fields[2]],
                })
              }
            />
          </div>
          <div className="d-flex flex-fill">
            <Form.Control
              className="my-auto w-100"
              style={{
                height: '30px',
              }}
              defaultValue={fields[1]}
              onChange={(e) =>
                handleMatrixChange({
                  name,
                  fields: [fields[0], e.target.value, fields[2]],
                })
              }
            />
          </div>
          <div className="d-flex flex-fill">
            <Form.Control
              className="my-auto w-100"
              style={{
                height: '30px',
              }}
              defaultValue={fields[2]}
              onChange={(e) =>
                handleMatrixChange({
                  name,
                  fields: [fields[0], fields[1], e.target.value],
                })
              }
            />
          </div>
        </div>
      </div>
      <svg
        style={{
          marginLeft: `${margin.left}px`,
          marginRight: `${margin.right}px`,
        }}
        width={width - margin.left}
        height={height}
      >
        <LinearGradient id="stroke" from="#ff00a5" to="#ffc500" />
        <rect
          fill="#fff"
          // x={500}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          rx={7}
        />
        <Group left={0} top={margin.top}>
          <GridRows
            scale={gridXScale}
            width={xMax}
            height={yMax}
            numTicks={2}
            stroke="#0a004e"
          />
          <GridColumns
            scale={gridYScale}
            width={xMax}
            height={yMax}
            numTicks={2}
            stroke="#0a004e"
          />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom
            label={`價格(${currency})`}
            top={yMax}
            scale={timeScale}
            tickLabelProps={{
              fontSize: 14,
            }}
            numTicks={10}
            labelClassName="fs-6"
          />
          <AxisLeft
            scale={customScale}
            tickValues={[0, 1, 2, 3, 4, 5, 6]}
            tickComponent={tickComponent}
          />
        </Group>

        {draggingItems.map((d, i) => (
          <Drag
            key={`drag-${d.id}`}
            width={width - margin.left - margin.right}
            height={height - margin.top - margin.bottom}
            x={timeScale(d.x)}
            y={toPos(d.y)}
            onDragStart={() => {
              // svg follows the painter model
              // so we need to move the data item
              // to end of the array for it to be drawn
              // "on top of" the other data items
              setDraggingItems(raise(draggingItems, i))
            }}
            onDragEnd={({ x, y, dx, dy }) => {
              const array = module.reduce((prev, cur) => {
                const [min, max] = cur[3]
                  .split('~')
                  .map((c) => parseInt(c.replace(currency, ''), 10))
                if (!min || !max) return prev
                return [...prev, min, max]
              }, [])
              const sorted = Array.from(new Set(array))
                .filter((s) => s && !Number.isNaN(s))
                .sort((a, b) => a - b)
              const range = [
                sorted[0] * 0.8 || 0,
                sorted[sorted.length - 1] * 1.2 || 1000,
              ]
              const target = module[d.index]
              const ans = parseInt(
                range[0] +
                  (range[1] - range[0]) *
                    ((x + dx) / (width - margin.left - margin.right)),
                10
              )
              handleInputChange('product', d.index, [
                target[0],
                target[1],
                target[2],
                `${currency}${ans}~${currency}${ans}`,
                target[4],
                target[5],
                target[6],
                y + dy,
              ])
            }}
          >
            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
              <React.Fragment key={`dot-${d.id}`}>
                <text
                  x={x + 20}
                  y={y + 6}
                  height={100}
                  transform={`translate(${dx}, ${dy})`}
                  fontSize={16}
                  color="black"
                >
                  {d.name}
                </text>
                <circle
                  cx={x}
                  cy={y}
                  r={isDragging ? d.radius + 4 : d.radius}
                  fill={d.color}
                  transform={`translate(${dx}, ${dy})`}
                  fillOpacity={1}
                  stroke={isDragging ? 'white' : 'transparent'}
                  strokeWidth={2}
                  onMouseMove={dragMove}
                  onMouseUp={dragEnd}
                  onMouseDown={dragStart}
                  onTouchStart={dragStart}
                  onTouchMove={dragMove}
                  onTouchEnd={dragEnd}
                  cursor={isDragging ? 'grabbing' : 'grab'}
                />
              </React.Fragment>
            )}
          </Drag>
        ))}
      </svg>
    </div>
  )
}

function ColorForm({ setting }) {
  const { module, index, handleInputChange } = setting
  const [
    name = '- -',
    advance = [],
    weak = [],
    price = '- -',
    sp = '- -',
    audience = '- -',
    pr = 0,
    pa = 0,
  ] = module

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
    <>
      <Row
        className="w-100 flex-fill mx-0 p-0 text-dai fw-bold rounded my-1 p-2"
        style={{
          border: colors[index % 5],
          backgroundColor: bgcolors[index % 5],
          minHeight: '16%',
        }}
      >
        <Col className="d-flex">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai text-center"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            value={name}
            onDoubleClick={(e) => {
              const { offsetTop, offsetLeft, offsetWidth } = e.target
              setfloatSetting({
                top: offsetTop,
                left: offsetLeft,
                width: offsetWidth,
                visibility: 'visible',
                value: name,
                onBlur: () =>
                  setfloatSetting({
                    ...floatSetting,
                    visibility: 'hidden',
                  }),
                onChange: (value) => {
                  handleInputChange('product', index, [
                    value,
                    advance,
                    weak,
                    price,
                    sp,
                    audience,
                    pr,
                    pa,
                  ])
                },
              })
            }}
            onChange={(e) =>
              handleInputChange('product', index, [
                e.target.value,
                advance,
                weak,
                price,
                sp,
                audience,
                pr,
                pa,
              ])
            }
          />
        </Col>
        <Col className="d-flex px-1">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              resize: 'none',
            }}
            as="textarea"
            rows={2}
            value={price}
            onDoubleClick={(e) => {
              const { offsetTop, offsetLeft, offsetWidth } = e.target
              setfloatSetting({
                top: offsetTop,
                left: offsetLeft,
                width: offsetWidth,
                visibility: 'visible',
                value: price,
                onBlur: () =>
                  setfloatSetting({
                    ...floatSetting,
                    visibility: 'hidden',
                  }),
                onChange: (value) => {
                  handleInputChange('product', index, [
                    name,
                    advance,
                    weak,
                    value,
                    sp,
                    audience,
                    pr,
                    pa,
                  ])
                },
              })
            }}
            onChange={(e) =>
              handleInputChange('product', index, [
                name,
                advance,
                weak,
                e.target.value,
                sp,
                audience,
                pr,
                pa,
              ])
            }
          />
        </Col>
        <Col className="d-flex px-1">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            value={audience}
            onDoubleClick={(e) => {
              const { offsetTop, offsetLeft, offsetWidth } = e.target
              setfloatSetting({
                top: offsetTop,
                left: offsetLeft,
                width: offsetWidth,
                visibility: 'visible',
                value: audience,
                onBlur: () =>
                  setfloatSetting({
                    ...floatSetting,
                    visibility: 'hidden',
                  }),
                onChange: (value) => {
                  handleInputChange('product', index, [
                    name,
                    advance,
                    weak,
                    price,
                    sp,
                    value,
                    pr,
                    pa,
                  ])
                },
              })
            }}
            onChange={(e) =>
              handleInputChange('product', index, [
                name,
                advance,
                weak,
                price,
                sp,
                e.target.value,
                pr,
                pa,
              ])
            }
          />
        </Col>
      </Row>
      <FloatInput setting={floatSetting} />
    </>
  )
}

function SuggestMatrix({ setting }) {
  const {
    module = [],
    matrix = { fields: [], name: '' },
    handleCardAdd = () => {},
    handleInputChange = () => {},
    handleMatrixChange,
  } = setting

  // svg size
  const ref = useRef(null)
  const [svgSize, setsvgSize] = useState({
    width: 0,
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

  return (
    <Col className="h-100 w-100 pt-2 d-flex">
      <div
        className="h-100 d-flex flex-column"
        style={{
          width: '30%',
        }}
      >
        <Row
          className="px-3"
          style={{
            backgroundColor: 'white',
          }}
        >
          <Col>品牌名稱</Col>
          <Col>
            價格區間&ensp;
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip
                  style={{
                    zIndex: '9999',
                  }}
                >
                  右方矩陣圖曲以該價格區間之中間值顯示
                </Tooltip>
              }
            >
              <FontAwesomeIcon className="text-dai" icon={faCircleInfo} />
            </OverlayTrigger>
          </Col>
          <Col>主要客群</Col>
        </Row>
        <div className="h-90 d-flex flex-column overflow-scroll">
          {module && module.map
            ? module.map((m, index) => (
                <ColorForm
                  key={index}
                  setting={{
                    module: m,
                    index,
                    handleInputChange,
                  }}
                />
              ))
            : [1, 2, 3, 4, 5].map((key, index) => (
                <ColorForm
                  key={index}
                  setting={{
                    module: [],
                    index,
                    handleInputChange,
                  }}
                />
              ))}
          <Button
            title="新增"
            className="text-dai fs-7 p-2 d-flex mx-0 my-1 flex-column"
            style={{
              background: 'rgba(35, 61, 99, 0.1)',
              border: '1px solid rgba(35, 61, 99, 0.1)',
              borderRadius: '0.375rem',
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={() =>
              handleCardAdd('product', [
                '其他',
                ['', '', ''],
                ['', '', ''],
                '',
                '',
                '',
                '',
                '',
              ])
            }
          >
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="m-auto fs-4 text-dai-lighter fs-8"
            />
          </Button>
        </div>
      </div>
      <div
        ref={ref}
        className="d-flex flex-column"
        style={{
          width: '70%',
        }}
      >
        <XYDrag
          setting={{
            ...svgSize,
            module,
            matrix,
            handleInputChange,
            handleMatrixChange,
          }}
        />
      </div>
    </Col>
  )
}

ColorForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

XYDrag.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestMatrix.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestMatrix
