import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

function FloatInput({ setting }) {
  const {
    visibility,
    top,
    left,
    width,
    onBlur = () => {},
    onChange = () => {},
    value,
  } = setting
  const ref = useRef(null)

  const [temp, settemp] = useState('')
  useEffect(() => settemp(value), [value])
  useEffect(() => {
    if (ref.current) ref.current.focus()
  }, [visibility])

  return (
    <div
      className="position-absolute px-0"
      style={{
        color: '#212529',
        backgroundColor: '#fff',
        borderColor: '#86b7fe',
        outline: '0',
        boxShadow: '0 0 0 0.2rem inset rgb(202, 198, 230)',
        visibility,
        top,
        left,
        width,
        zIndex: '9999',
      }}
    >
      <Form.Control
        ref={ref}
        onBlur={() => {
          onChange(temp)
          settemp('')
          onBlur()
        }}
        as="textarea"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            onChange(temp)
            settemp('')
            onBlur()
          }
        }}
        onChange={(e) => {
          settemp(e.target.value)
        }}
        value={temp}
      />
    </div>
  )
}

FloatInput.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default FloatInput
