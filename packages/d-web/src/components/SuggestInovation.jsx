/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'
import { Row, Col, Card, Form, Accordion } from 'react-bootstrap'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import ImgWithFunc from './ImgWithFuncs'
import FloatInput from './FloatInput'

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!')
  )

  return (
    <div
      className="w-100 text-start"
      style={{
        cursor: 'pointer',
      }}
      onClick={decoratedOnClick}
      aria-hidden
    >
      {children}
    </div>
  )
}

function ColorCard({ setting }) {
  const {
    title = '- -',
    reason = '- -',
    star,
    pic1,
    pic2,
    bgcolor,
    index,
    handleInputChange = () => {},
  } = setting
  const [hoverRate, setHoverRate] = useState(0)

  const [floatSetting, setfloatSetting] = useState({
    visibility: 'hidden',
    top: '0px',
    left: '0px',
    width: '0px',
    value: '',
    onBlur: () => {},
    onChange: () => {},
  })

  const [height, setheight] = useState(0)
  const ref = useRef(null)

  const getSize = () => {
    if (ref.current) {
      const width = ref.current.clientWidth
      return { width }
    }
    return false
  }
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const size = getSize()
      if (size.width !== height) setheight(size.width)
    })
    observer.observe(ref.current)
    return () => ref.current && observer.unobserve(ref.current)
  }, [])

  return (
    <>
      <Card
        className="w-100 p-0 text-dai fw-bold"
        style={{
          height: '100%',
          border: '1px solid rgb(35, 61, 99, 0.7)',
          backgroundColor: bgcolor,
          // border: 'none',
        }}
      >
        <Card.Header>
          <Row
            className="m-0 h-100 w-95 d-flex"
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Col xs={2} className="fs-6 text-dai">
              方案{index + 1}
            </Col>
            <Col xs={10}>
              <Form.Control
                className="my-auto py-0 fw-regular fs-6 text-dai text-center h-100"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  color: '#0a004e',
                  cursor: 'ew-resize',
                }}
                value={title}
                onDoubleClick={(e) => {
                  const { offsetTop, offsetLeft, offsetWidth } = e.target
                  setfloatSetting({
                    top: offsetTop,
                    left: offsetLeft,
                    width: offsetWidth,
                    visibility: 'visible',
                    value: title,
                    onBlur: () =>
                      setfloatSetting({
                        ...floatSetting,
                        visibility: 'hidden',
                      }),
                    onChange: (value) => {
                      handleInputChange('inovation', index, [
                        value,
                        star,
                        reason,
                        pic1,
                        pic2,
                      ])
                    },
                  })
                }}
                onChange={(e) =>
                  handleInputChange('inovation', index, [
                    e.target.value,
                    star,
                    reason,
                    pic1,
                    pic2,
                  ])
                }
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="position-relative d-flex flex-column">
          <div className="d-flex w-50 mx-auto">
            推薦度：
            {[1, 2, 3, 4, 5].map((rate) => (
              <FontAwesomeIcon
                key={rate}
                icon={
                  hoverRate > 0
                    ? hoverRate >= rate
                      ? solidStar
                      : regularStar
                    : parseInt(star, 10) >= rate
                    ? solidStar
                    : regularStar
                }
                style={{
                  cursor: 'pointer',
                }}
                className="m-auto fs-7 text-dai-light"
                onMouseEnter={() => setHoverRate(rate)}
                onMouseLeave={() => setHoverRate(0)}
                onClick={() =>
                  handleInputChange('inovation', index, [
                    title,
                    rate,
                    reason,
                    pic1,
                    pic2,
                  ])
                }
                title="刪除"
              />
            ))}
          </div>
          <Accordion className="overflow-scroll" defaultActiveKey="0">
            <Card>
              {/* <Card.Header>
              <CustomToggle eventKey="0">方案內容</CustomToggle>
            </Card.Header> */}
              <Accordion.Collapse eventKey="0">
                <Card.Body className="p-0">
                  <Form.Control
                    // rows={6}
                    style={{
                      minHeight: '290px',
                      fontSize: '0.93rem',
                    }}
                    as="textarea"
                    value={reason}
                    onChange={(e) =>
                      handleInputChange('inovation', index, [
                        title,
                        star,
                        e.target.value,
                        pic1,
                        pic2,
                      ])
                    }
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <Row className="w-100 d-flex h-50 mx-auto">
            <div
              className="p-2 w-50"
              ref={ref}
              style={{
                height: `${height}px`,
              }}
            >
              <ImgWithFunc
                setting={{
                  id: `${index}_1`,
                  funcs: [],
                  src: pic1,
                  handlePicChange: (path) => {
                    handleInputChange('inovation', index, [
                      title,
                      star,
                      reason,
                      path,
                      pic2,
                    ])
                  },
                }}
              />
            </div>
            <div
              className="p-2 w-50"
              style={{
                height: `${height}px`,
              }}
            >
              <ImgWithFunc
                setting={{
                  id: `${index}_2`,
                  funcs: [],
                  src: pic2,
                  handlePicChange: (path) => {
                    handleInputChange('inovation', index, [
                      title,
                      star,
                      reason,
                      pic1,
                      path,
                    ])
                  },
                }}
              />
            </div>
          </Row>
        </Card.Body>
      </Card>
      <FloatInput setting={floatSetting} />
    </>
  )
}

function SuggestInovation({ setting }) {
  const { module } = setting
  const bgcolors = [
    'rgb(35, 61, 99, 0.1)',
    'rgb(51, 107, 139, 0.1)',
    'rgb(234, 112, 11, 0.1)',
    'rgb(240, 181, 31, 0.1)',
    'rgb(131, 152, 77, 0.1)',
  ]
  return (
    <Row className="w-100 h-100 pt-2">
      {module
        ? module.map(([title, star, reason, pic1, pic2], i) => (
            <Col
              xs={4}
              key={i}
              className="h-100 p-3 py-1 position-relative"
              style={{
                maxHeight: '100%',
              }}
            >
              <ColorCard
                setting={{
                  title,
                  reason,
                  star,
                  pic1,
                  pic2,
                  bgcolor: bgcolors[i],
                  index: i,
                  ...setting,
                }}
              />
            </Col>
          ))
        : [1, 2, 3].map((key, i) => (
            <Col xs={4} key={key} className="h-100 p-3">
              <ColorCard
                setting={{
                  bgcolor: bgcolors[i],
                }}
              />
            </Col>
          ))}
    </Row>
  )
}

CustomToggle.propTypes = {
  children: PropTypes.shape().isRequired,
  eventKey: PropTypes.number.isRequired,
}

ColorCard.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestInovation.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestInovation
