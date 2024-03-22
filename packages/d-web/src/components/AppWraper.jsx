import React, { useEffect, useMemo, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import SideNavBar from './SideNavBar'
import TopBar from './TopBar'
// import GPTHelper from './GPTHelper'
import { AuthContext, DraftContext } from './ContextProvider'

function AppWrapper({ children }) {
  const { auth } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const { draftId } = useContext(DraftContext)

  const isInDraft = useMemo(
    () =>
      ['/Module1', '/Module2', '/Module3', '/Module4'].includes(
        location.pathname
      ),
    [location]
  )
  useEffect(() => {
    if (draftId && !isInDraft) {
      navigate('/Module1')
    }
    if ((!auth.authed || !draftId) && isInDraft) {
      navigate('/')
    }
  }, [auth, location, draftId])

  return auth.authed ? (
    <div
      className="d-flex position-relative overflow-hidden"
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Col xs={1}>
        <SideNavBar setting={{}} />
      </Col>
      <Col xs={11} className="d-flex flex-column px-0">
        {isInDraft && (
          <Row
            className="h-8 ps-4"
            style={{ borderBottom: '1px solid #eee', minHeight: '8%' }}
          >
            <TopBar />
          </Row>
        )}
        <Row
          className={`${
            isInDraft ? 'h-86' : 'h-96'
          } p-4 overflow-hidden position-relative`}
        >
          {children}
        </Row>
        <div className="small fw-bold text-wom-light pt-2">
          Copyright © 2024 Wavenet all rights reserved. ｜ Powered by Wavenet
          Inc.
        </div>
      </Col>
      {/* <GPTHelper setting={{}} /> */}
    </div>
  ) : (
    <div
      className="d-flex position-relative"
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Col xs={12} className="d-flex flex-column">
        <Row className="flex-fill">{children}</Row>
      </Col>
    </div>
  )
}

AppWrapper.propTypes = {
  children: PropTypes.shape().isRequired,
  //   setting: PropTypes.shape().isRequired,
}

export default AppWrapper
