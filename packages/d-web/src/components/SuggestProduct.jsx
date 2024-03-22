import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form } from 'react-bootstrap'
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
        }}
      >
        <div className="d-flex" style={{ width: '5%' }}>
          <p className="m-auto">{index + 1}</p>
        </div>
        <div className="d-flex flex-fill" style={{ width: '9%' }}>
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
        </div>
        <Col xs={2} className="d-flex h-100 flex-column px-1 flex-fill">
          {advance.map((a, i) => (
            <Row key={i} className="d-flex h-33">
              <Col className="d-flex">
                <p className="w-10 my-auto">{i + 1}.</p>
                <Form.Control
                  className="my-auto py-0 fw-regular fs-7 text-dai"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    cursor: 'ew-resize',
                  }}
                  value={a}
                  onDoubleClick={(e) => {
                    const { offsetTop, offsetLeft, offsetWidth } = e.target
                    setfloatSetting({
                      top: offsetTop,
                      left: offsetLeft,
                      width: offsetWidth,
                      visibility: 'visible',
                      value: a,
                      onBlur: () =>
                        setfloatSetting({
                          ...floatSetting,
                          visibility: 'hidden',
                        }),
                      onChange: (value) => {
                        handleInputChange('product', index, [
                          name,
                          advance.map((item, j) => (i === j ? value : item)),
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
                      name,
                      advance.map((item, j) =>
                        i === j ? e.target.value : item
                      ),
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
            </Row>
          ))}
        </Col>
        <Col xs={2} className="d-flex h-100 flex-column px-1 flex-fill">
          {weak.map((a, i) => (
            <Row key={i} className="d-flex h-33">
              <Col className="d-flex">
                <p className="w-10 my-auto">{i + 1}.</p>
                <Form.Control
                  className="my-auto py-0 fw-regular fs-7 text-dai"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    cursor: 'ew-resize',
                  }}
                  value={a}
                  onDoubleClick={(e) => {
                    const { offsetTop, offsetLeft, offsetWidth } = e.target
                    setfloatSetting({
                      top: offsetTop,
                      left: offsetLeft,
                      width: offsetWidth,
                      visibility: 'visible',
                      value: a,
                      onBlur: () =>
                        setfloatSetting({
                          ...floatSetting,
                          visibility: 'hidden',
                        }),
                      onChange: (value) => {
                        handleInputChange('product', index, [
                          name,
                          advance,
                          weak.map((item, j) => (i === j ? value : item)),
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
                      name,
                      advance,
                      weak.map((item, j) => (i === j ? e.target.value : item)),
                      price,
                      sp,
                      audience,
                      pr,
                      pa,
                    ])
                  }
                />
              </Col>
            </Row>
          ))}
        </Col>
        <Col xs={1} className="d-flex px-1 flex-fill">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows={3}
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
        <Col xs={1} className="d-flex px-1 flex-fill">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows={3}
            value={sp}
            onDoubleClick={(e) => {
              const { offsetTop, offsetLeft, offsetWidth } = e.target
              setfloatSetting({
                top: offsetTop,
                left: offsetLeft,
                width: offsetWidth,
                visibility: 'visible',
                value: sp,
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
                    value,
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
                price,
                e.target.value,
                audience,
                pr,
                pa,
              ])
            }
          />
        </Col>
        <Col xs={1} className="d-flex px-1 flex-fill">
          <Form.Control
            className="my-auto py-0 fw-regular fs-7 text-dai"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            as="textarea"
            rows={3}
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

function SuggestProduct({ setting }) {
  const { module, handleInputChange } = setting

  return (
    <Col className="h-100 w-100 pt-2 d-flex flex-column">
      <Row
        className="px-3"
        style={{
          backgroundColor: 'white',
        }}
      >
        <div style={{ width: '5%' }}>序號</div>
        <div style={{ width: '9%' }} className="flex-fill">
          品牌名稱
        </div>
        <Col xs={2} className="flex-fill">
          優勢
        </Col>
        <Col xs={2} className="flex-fill">
          劣勢
        </Col>
        <Col xs={1} className="flex-fill">
          價格區間
        </Col>
        <Col xs={1} className="flex-fill">
          產品特點
        </Col>
        <Col xs={1} className="flex-fill">
          主要客群
        </Col>
      </Row>
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
            // <Row
            //   className="flex-fill"
            //   key={key}
            //   style={{
            //     backgroundColor: bgcolors[i],
            //   }}
            // >
            //   <Col>{i + 1}</Col>
            //   <Col>{key}</Col>
            //   <Col>{module[key].advance.join()}</Col>
            //   <Col>{module[key].weak.join()}</Col>
            //   <Col>價格一</Col>
            //   <Col>特點</Col>
            //   <Col>客群</Col>
            // </Row>
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
    </Col>
  )
}

ColorForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestProduct.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestProduct
