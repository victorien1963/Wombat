/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form } from 'react-bootstrap'
import FloatInput from './FloatInput'

function ColorForm({ setting }) {
  const {
    label,
    engLabel,
    color,
    bgcolor,
    module = {},
    handleInputChange,
  } = setting
  const filledArray = module[label] || [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ]

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
        className="w-100 mx-0 p-0 text-wom fw-bold rounded my-1 p-2"
        style={{
          border: color,
          backgroundColor: bgcolor,
        }}
      >
        <Col xs={2} className="d-flex">
          <p className="m-auto">
            {label} {engLabel}
          </p>
        </Col>
        <Col
          className="d-flex h-100 flex-column"
          style={{ overflowY: 'hidden' }}
        >
          {filledArray.map(([tag, content, memo, id], i) => (
            <Row key={i} className="d-flex h-33">
              <Col className="d-flex" xs={2}>
                <p className="w-10 my-auto">{i + 1}.</p>
                <Form.Control
                  className="my-auto py-0 fw-regular fs-7 text-wom"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  value={tag}
                  onDoubleClick={(e) => {
                    const { offsetTop, offsetLeft, offsetWidth } = e.target
                    setfloatSetting({
                      top: offsetTop,
                      left: offsetLeft,
                      width: offsetWidth,
                      visibility: 'visible',
                      value: tag,
                      onBlur: () =>
                        setfloatSetting({
                          ...floatSetting,
                          visibility: 'hidden',
                        }),
                      onChange: (value) => {
                        handleInputChange(label, i, [value, content, memo, id])
                      },
                    })
                  }}
                  onChange={(e) =>
                    handleInputChange(label, i, [
                      e.target.value,
                      content,
                      memo,
                      id,
                    ])
                  }
                />
              </Col>
              <Col className="d-flex">
                <Form.Control
                  className="my-auto py-0 fw-regular fs-7 text-wom"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  value={content}
                  onDoubleClick={(e) => {
                    const { offsetTop, offsetLeft, offsetWidth } = e.target
                    setfloatSetting({
                      top: offsetTop,
                      left: offsetLeft,
                      width: offsetWidth,
                      visibility: 'visible',
                      value: content,
                      onBlur: () =>
                        setfloatSetting({
                          ...floatSetting,
                          visibility: 'hidden',
                        }),
                      onChange: (value) => {
                        handleInputChange(label, i, [tag, value, memo, id])
                      },
                    })
                  }}
                  onChange={(e) =>
                    handleInputChange(label, i, [tag, e.target.value, memo, id])
                  }
                />
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <FloatInput setting={floatSetting} />
    </>
  )
}

function SuggestForm({ setting }) {
  const { module, handleInputChange } = setting
  return (
    <Row
      className="w-100 h-100 pt-2 ps-3"
      style={{
        overflowY: 'auto',
      }}
    >
      {[
        {
          label: '政治',
          engLabel: '(Political)',
          key: 'Political',
          color: '1px solid rgb(35, 61, 99, 0.7)',
          bgcolor: 'rgb(35, 61, 99, 0.1)',
        },
        {
          label: '經濟',
          engLabel: '(Economic)',
          key: 'Economic',
          color: '1px solid rgb(51, 107, 139, 0.7)',
          bgcolor: 'rgb(51, 107, 139, 0.1)',
        },
        {
          label: '社會',
          engLabel: '(Social)',
          key: 'Social',
          color: '1px solid rgb(234, 112, 11, 0.7)',
          bgcolor: 'rgb(234, 112, 11, 0.1)',
        },
        {
          label: '技術',
          engLabel: '(Technological)',
          key: 'Technological',
          color: '1px solid rgb(240, 181, 31, 0.7)',
          bgcolor: 'rgb(240, 181, 31, 0.1)',
        },
        {
          label: '環境',
          engLabel: '(Environmental)',
          key: 'Environmental',
          color: '1px solid rgb(131, 152, 77, 0.7)',
          bgcolor: 'rgb(131, 152, 77, 0.1)',
        },
        {
          label: '法律',
          engLabel: '(Legal)',
          key: 'Legal',
          color: '1px solid rgb(66, 63, 63, 0.7)',
          bgcolor: 'rgb(66, 63, 63, 0.1)',
        },
      ].map(({ key, label, engLabel, color, bgcolor }) => (
        <ColorForm
          key={key}
          setting={{
            label,
            engLabel,
            color,
            bgcolor,
            module,
            handleInputChange,
          }}
        />
      ))}
    </Row>
  )
}

ColorForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

SuggestForm.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default SuggestForm
