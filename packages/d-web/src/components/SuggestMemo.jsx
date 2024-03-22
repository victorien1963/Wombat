import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, Form } from 'react-bootstrap'

function ColorCard({ setting }) {
  const {
    label,
    engLabel,
    color,
    bgcolor,
    module = {},
    handleInputChange,
  } = setting
  return (
    <Card
      className="h-100 w-100 p-0 text-wom fw-bold"
      style={{
        backgroundColor: bgcolor,
        border: color,
      }}
    >
      <Card.Header>
        <span className="text-nowrap">
          {label}（ {engLabel} ）
        </span>
      </Card.Header>
      {module[label] && (
        <Card.Body className="position-relative d-flex flex-column">
          {module[label].map(([tag, content, memo], i) => (
            <div className="my-auto py-0 fw-regular fs-6 text-wom d-flex px-2">
              <p className="my-auto fw-regular text-wom fs-6">{i + 1}.</p>
              <Form.Control
                key={tag}
                className="text-wom"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                }}
                defaultValue={memo}
                onChange={(e) =>
                  handleInputChange(label, i, [content, e.target.value])
                }
              />
            </div>
          ))}
        </Card.Body>
      )}
    </Card>
  )
}

function SuggestCard({ setting }) {
  const { module, handleInputChange } = setting
  return (
    <Row className="h-90 w-100 pt-2">
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
        <Col xs={4} key={key} className="p-1">
          <ColorCard
            setting={{
              label,
              engLabel,
              color,
              bgcolor,
              module,
              handleInputChange,
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

export default SuggestCard
