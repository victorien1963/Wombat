/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useMemo, createContext } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Manager } from 'socket.io-client'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import apiServices from '../services/apiServices'

function ContextProvider(props) {
  const { children } = props
  const [auth, setAuth] = useState({
    authed: false,
  })
  const authValue = useMemo(() => ({ auth, setAuth }), [auth])
  const { authed, user_id } = auth

  const checkToken = async () => {
    const { user } = await apiServices.me()
    if (user) {
      setAuth({
        authed: true,
        ...user,
      })
    }
  }
  useEffect(() => {
    checkToken()
  }, [])

  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (!authed) return () => {}
    const manager = new Manager(window.location.origin)
    const newSocket = manager.socket('/', {
      auth: {
        auth: user_id,
      },
    })
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket, authed, user_id])
  const sendMessage = (type, message) => socket.emit(type, message)
  const socketValue = useMemo(() => ({ socket, sendMessage }), [socket])

  // model
  const [model, setModel] = useState('gpt-3.5-turbo')
  const handleModelChange = (target) => sendMessage('model', target)

  // logs
  // const [logs, setLogs] = useState([])
  // useEffect(() => {
  //   const initLogs = async () => {
  //     const res = await apiServices.data({
  //       path: '/gptLog',
  //       method: 'get',
  //     })
  //     setLogs(res)
  //   }
  //   if (authed) initLogs()
  // }, [authed])

  const [drafts, setDrafts] = useState(false)
  const [draftId, setDraftId] = useState('')
  const handleDraftAdd = async (data = {}) => {
    const res = await apiServices.data({
      path: '/draft',
      method: 'post',
      data,
    })
    setDrafts((prevState) => [res, ...prevState])
  }
  const handleDraftDelete = async (draft_id) => {
    const res = await apiServices.data({
      path: `/draft/${draft_id}`,
      method: 'delete',
    })
    setDrafts((prevState) =>
      prevState.filter((p) => res.draft_id !== p.draft_id)
    )
  }
  const draft = useMemo(
    () =>
      drafts && draftId
        ? drafts.find(({ draft_id }) => draft_id === draftId)
        : {
            setting: {
              module1: {},
              module2: {},
              module3: {},
              module4: {},
            },
          },
    [drafts, draftId]
  )

  const [process, setprocess] = useState({})

  // undo and redo
  const [history, setHistory] = useState([])
  const [recoverTarget, setRecoverTarget] = useState(-1)
  const [cursor, setCursor] = useState(-1)
  const handleRecover = (target) => setRecoverTarget(target)

  const {
    module1 = {},
    module2 = {},
    module3 = {},
    module4 = {},
  } = draft.setting
  const draftValue = useMemo(
    () => ({
      // history
      history,
      setHistory,
      recoverTarget,
      setRecoverTarget,
      cursor,
      setCursor,
      handleRecover,
      // draft
      process,
      model,
      handleModelChange,
      module1,
      module2,
      module3,
      module4,
      drafts,
      draftId,
      setDraftId,
      handleDraftAdd,
      handleDraftDelete,
      setDrafts,
      setDraft: (data, selectedId = '') => {
        if (selectedId) {
          const target = drafts && drafts.find((d) => d.draft_id === selectedId)
          if (target) {
            sendMessage('draft', {
              action: 'update',
              data: {
                ...target,
                setting: {
                  ...target.setting,
                  ...data,
                },
              },
            })
          }
        }
        setDrafts((prevState) =>
          prevState
            ? prevState.map((p) =>
                p.draft_id === (draftId || selectedId)
                  ? {
                      ...p,
                      setting: { ...p.setting, ...data },
                    }
                  : p
              )
            : prevState
        )
      },
    }),
    [drafts, draftId, process, model, cursor, recoverTarget, history]
  )

  useEffect(() => {
    if (!socket) return
    socket.on('draft', (message) => {
      setDrafts(
        message.sort((a, b) =>
          moment(b.updated_on).isAfter(moment(a.updated_on)) ? 1 : -1
        )
      )
    })
    socket.on('me', (message) => {
      setAuth({
        ...auth,
        setting: {
          ...(auth.setting || {}),
          ...message,
        },
      })
    })
    socket.on('model', (message) => setModel(message))
  }, [socket])

  useEffect(() => {
    if (!drafts) return
    socket.removeAllListeners('module1')
    socket.removeAllListeners('module2')
    socket.removeAllListeners('module3')
    socket.removeAllListeners('module4')
    socket.on('module1', (message) => {
      const target = drafts.find((d) => d.draft_id === message.draftId)
      if (!target) return
      const { ts } = target.setting.module1
      const isMatch = !message.t || message.t === ts
      if (isMatch) {
        setprocess((prevState) => ({
          ...prevState,
          [draftId]: {
            ...prevState[draftId],
            module1: {
              process: message.process,
              max: message.max,
              time: message.time,
              ts: Date.now(),
            },
          },
        }))
        setDrafts((prevState) =>
          prevState
            ? prevState.map((p) =>
                p.draft_id === message.draftId
                  ? {
                      ...p,
                      setting: {
                        ...p.setting,
                        module1: {
                          ...p.setting.module1,
                          ...message,
                        },
                      },
                    }
                  : p
              )
            : prevState
        )
      }
    })
    socket.on('module2', (message) => {
      const target = drafts.find((d) => d.draft_id === message.draftId)
      if (!target) return
      const { ts } = target.setting.module2
      const isMatch = !message.t || message.t === ts
      if (isMatch) {
        setprocess((prevState) => ({
          ...prevState,
          [draftId]: {
            ...prevState[draftId],
            module2: {
              process: message.process,
              max: message.max,
              time: message.time,
              ts: Date.now(),
            },
          },
        }))
        setDrafts((prevState) =>
          prevState
            ? prevState.map((p) =>
                p.draft_id === message.draftId
                  ? {
                      ...p,
                      setting: {
                        ...p.setting,
                        module2: {
                          ...p.setting.module2,
                          ...message,
                        },
                      },
                    }
                  : p
              )
            : prevState
        )
      }
    })
    socket.on('module3', (message) => {
      const target = drafts.find((d) => d.draft_id === message.draftId)
      if (!target) return
      const { ts } = target.setting.module3
      const isMatch = !message.t || message.t === ts
      if (isMatch) {
        setprocess((prevState) => ({
          ...prevState,
          [draftId]: {
            ...prevState[draftId],
            module4: {
              process: message.process,
              max: message.max,
              time: message.time,
              ts: Date.now(),
            },
          },
        }))
        setDrafts((prevState) =>
          prevState
            ? prevState.map((p) =>
                p.draft_id === message.draftId
                  ? {
                      ...p,
                      setting: {
                        ...p.setting,
                        module3: {
                          ...p.setting.module3,
                          ...message,
                        },
                      },
                    }
                  : p
              )
            : prevState
        )
      }
    })
    socket.on('module4', (message) => {
      const target = drafts.find((d) => d.draft_id === message.draftId)
      if (!target) return
      const { ts } = target.setting.module4
      const isMatch = !message.t || message.t === ts
      if (isMatch) {
        setprocess((prevState) => ({
          ...prevState,
          [draftId]: {
            ...prevState[draftId],
            module3: {
              process: message.process,
              max: message.max,
              time: message.time,
              ts: Date.now(),
            },
          },
        }))
        setDrafts((prevState) =>
          prevState
            ? prevState.map((p) =>
                p.draft_id === message.draftId
                  ? {
                      ...p,
                      setting: {
                        ...p.setting,
                        module4: {
                          ...p.setting.module4,
                          ...message,
                        },
                      },
                    }
                  : p
              )
            : prevState
        )
      }
    })
  }, [drafts])

  useEffect(() => {
    if (!socket) return
    if (!drafts) {
      sendMessage('draft', { action: 'init' })
    }
    if (draftId) {
      sendMessage('draft', { action: 'update', data: draft })
    }
  }, [socket, draft])

  const [toast, setToast] = useState({ show: false, text: '' })
  const toastValue = useMemo(() => ({ toast, setToast }), [toast])
  return (
    <>
      {/* <NotiContext.Provider value={notification}> */}
      <ToastContext.Provider value={toastValue}>
        <AuthContext.Provider value={authValue}>
          <DraftContext.Provider value={draftValue}>
            <SocketContext.Provider value={socketValue}>
              {children}
            </SocketContext.Provider>
          </DraftContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
      {/* </NotiContext.Provider> */}
      <ToastContainer className="p-3" position="bottom-end">
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
          style={{ width: '100%' }}
        >
          <Toast.Body>{toast.text}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.shape().isRequired,
}

export default ContextProvider

export const DraftContext = createContext(null)
// export const NotiContext = createContext([])
export const SocketContext = createContext({
  socket: null,
  sendMessage: () => {},
})
export const AuthContext = createContext({
  auth: {
    authed: false,
  },
  setAuth: () => {},
})
export const ToastContext = createContext({
  toast: { show: false, text: '' },
  setToast: () => {},
})
