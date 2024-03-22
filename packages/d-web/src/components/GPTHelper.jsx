import React, { useState, useEffect, useContext, useRef } from 'react'
import moment from 'moment'
import { Row, Col, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinus,
  faPaperPlane,
  faRobot,
} from '@fortawesome/free-solid-svg-icons'
import Searchbar from './SearchBar'
import { SocketContext } from './ContextProvider'
import { robot } from '../asset'

function GPTHelper() {
  const [show, setShow] = useState(false)
  const [generating, setgenerating] = useState(false)
  const [chats, setChats] = useState([])
  const [gptMessage, setGptMessage] = useState('')

  // scroll to bottom every new chat
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, gptMessage, ref.current])

  const { socket } = useContext(SocketContext)
  useEffect(() => {
    if (socket !== null) {
      socket.on('gpt', (message) => {
        if (message) setChats(message)
      })
      // can receive streaming response too
      socket.on('stream', (message) => {
        if (message) setGptMessage((prevState) => `${prevState}${message}`)
      })
      socket.on('chat', (message) => {
        setgenerating(message.setting.from !== 'gpt')
        setGptMessage('')
        if (message) setChats((prevState) => [...prevState, message])
      })
    }
  }, [socket])

  const sendMessage = (text) => socket.emit('gpt', text)

  return (
    <div
      className="position-absolute w-35 h-75 d-flex flex-column justify-content-end px-5 py-4"
      style={{
        maxHeight: '75%',
        right: 0,
        bottom: 0,
        zIndex: '9999',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <Row
        className="h-90 border d-flex flex-column p-3 bg-light rounded"
        style={{
          visibility: show ? 'visible' : 'hidden',
        }}
      >
        <div className="d-flex h-6">
          <h6 className="mx-auto fw-bolder fs-7 text-dai">dAI 小幫手</h6>
          <div
            className="position-absolute fs-7"
            style={{ top: '3.5%', right: '11.5%', cursor: 'pointer' }}
            onClick={() => setShow(!show)}
            aria-hidden
          >
            <FontAwesomeIcon icon={faMinus} title="收合" />
          </div>
        </div>
        <div className="h-86 border bg-white rounded overflow-scroll d-flex flex-column">
          {(chats.map ? chats : []).map(({ chat_id, setting, created_on }) => {
            const { chat, from } = setting
            return (
              <Row
                key={chat_id}
                className={
                  from === 'gpt'
                    ? 'w-100 d-flex justify-content-start mx-0 px-1 py-3'
                    : 'w-100 d-flex justify-content-end mx-0 px-1 py-3'
                }
              >
                {from === 'gpt' && (
                  <Col xs={1} className="px-0">
                    <FontAwesomeIcon
                      icon={faRobot}
                      src={robot}
                      style={{
                        // cursor: 'pointer',
                        // filter:
                        //   'drop-shadow(5px 5px 5px rgba(0, 999, 999, 0.7)',
                        zIndex: '555',
                        height: '1.5rem',
                        width: 'auto',
                      }}
                      className="ms-auto mt-auto fs-1 text-dai-light"
                      // onClick={() => setShow(!show)}
                      title={show ? '隱 藏' : 'dAI 小 幫 手'}
                    />
                  </Col>
                )}
                <Col
                  xs={from === 'gpt' ? '11' : 'auto'}
                  className="d-flex flex-column justify-content-center"
                >
                  <div
                    className={`border rounded px-2 py-1 ${
                      from === 'gpt'
                        ? 'text-start bg-dai-light'
                        : 'text-end bg-grey'
                    }`}
                  >
                    {chat}
                  </div>
                  <div className="fs-8 fw-bold text-end text-grey">
                    {moment(created_on).format('MM/HH hh:mm a')}
                  </div>
                </Col>
              </Row>
            )
          })}
          {generating && (
            <Row className="w-100 h-25 d-flex justify-content-start mx-0 px-1 py-3">
              <Col xs={1} className="px-0">
                <FontAwesomeIcon
                  icon={faRobot}
                  src={robot}
                  style={{
                    // cursor: 'pointer',
                    // filter: 'drop-shadow(5px 5px 5px rgba(0, 999, 999, 0.7)',
                    zIndex: '555',
                    height: '1.5rem',
                    width: 'auto',
                  }}
                  className="ms-auto mt-auto fs-1 text-dai-light"
                  // onClick={() => setShow(!show)}
                  title={show ? '隱 藏' : 'dAI 小 幫 手'}
                />
              </Col>

              <Col
                xs={11}
                className="d-flex flex-column justify-content-center"
              >
                <div className="border rounded px-2 py-1 text-start">
                  {gptMessage}...
                </div>
              </Col>
            </Row>
          )}
          <div ref={ref} />
        </div>
        <div className="px-0 h-6">
          <Searchbar
            setting={{
              method: sendMessage,
              action: <FontAwesomeIcon icon={faPaperPlane} />,
            }}
          />
        </div>
      </Row>
      <Row className="h-10 d-flex ms-auto">
        <Image
          src={robot}
          style={{
            cursor: 'pointer',
            filter: 'drop-shadow(5px 5px 5px rgba(0, 999, 999, 0.7)',
            zIndex: '555',
            height: '3rem',
            width: 'auto',
            pointerEvents: 'auto',
          }}
          className="ms-auto mt-auto fs-1 text-dai-light"
          onClick={() => setShow(!show)}
          title={show ? '隱 藏' : 'dAI 小 幫 手'}
        />
        <i
          className="loader-dot mx-auto mt-auto"
          style={{ bottom: '20%', right: '-12%' }}
        />
      </Row>
      <Row
        className="small ms-auto pt-1 pe-2"
        style={{
          filter: 'drop-shadow(5px 5px 5px rgba(0, 999, 999, 0.9)',
          fontWeight: '900',
        }}
      >
        dAI Robot
      </Row>
    </div>
  )
}

export default GPTHelper
