/* eslint-disable no-promise-executor-return */
import React, { useEffect, useState, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { Spinner, ProgressBar } from 'react-bootstrap'
import { DraftContext } from './ContextProvider'

function Loading({ setting }) {
  const { show, step, handleInterrupt } = setting
  const DC = useContext(DraftContext)
  const location = useLocation()
  const modules = {
    '/Module1': 'module1',
    '/Module2': 'module2',
    '/Module3': 'module3',
    '/Module4': 'module4',
  }
  const {
    process = 0,
    max = 99,
    time = 50,
    ts = Date.now(),
  } = useMemo(
    () =>
      DC.process[DC.draftId] &&
      DC.process[DC.draftId][modules[location.pathname]]
        ? DC.process[DC.draftId][modules[location.pathname]]
        : {},
    [DC.process]
  )

  const [progress, setprogress] = useState(
    process + Math.min((Date.now() - ts) / (time * 100), 1) * (max - process)
  )

  const delaySetProgress = async (p, m, t, s, shouldDelay = false) => {
    if (shouldDelay) {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      await delay(time)
    }
    setprogress(p + Math.min((Date.now() - s) / (t * 100), 1) * (m - p))
  }

  useEffect(() => {
    if (show) {
      delaySetProgress(process, max, time, ts, true)
    }
  }, [progress, process, max, time, ts])
  useEffect(() => {
    if (show) {
      delaySetProgress(process, max, time, ts, false)
    } else {
      delaySetProgress(0, 1, 50, 0, false)
    }
  }, [show])
  // useEffect(() => setprogress(process), [process])

  return (
    <div
      className="w-100 h-100 d-flex flex-column position-absolute"
      style={{
        zIndex: '9999',
        pointerEvents: show ? 'auto' : 'none',
        visibility: show ? 'visible' : 'hidden',
        backgroundColor: 'white',
        opacity: '0.75',
      }}
    >
      <div className="d-flex mt-auto justify-content-center">
        <Spinner
          className="my-auto"
          animation="border"
          size="sm"
          style={{
            animation: 'spinner-border 1.5s linear infinite',
          }}
        />
        <h5 className="text-wom fs-4 my-auto ms-2">
          {step ? `${step}...` : '資料生成中...'}
        </h5>
      </div>
      <ProgressBar
        className="rounded-pill fs-6 my-2 mx-auto w-50"
        style={{ height: '30px' }}
      >
        <ProgressBar
          animated
          style={{
            backgroundColor: '#0a004f',
          }}
          now={progress}
          label={`${parseInt(progress, 10)}%`}
        />
        <ProgressBar
          now={100 - progress}
          style={{
            backgroundColor: '#e2e4e8',
          }}
        />
      </ProgressBar>
      <div className="d-flex mb-auto mt-3 justify-content-center">
        <span
          className="text-wom fs-8"
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={handleInterrupt}
          aria-hidden
        >
          取消
        </span>
      </div>
    </div>
  )
}

Loading.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default Loading
