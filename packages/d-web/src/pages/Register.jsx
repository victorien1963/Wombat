import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, InputGroup, Image, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { AuthContext, ToastContext } from '../components/ContextProvider'
import apiServices from '../services/apiServices'
import { LoadingButton } from '../components'
import { logoFull } from '../asset'

function Register() {
  const { setToast } = useContext(ToastContext)
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

  const [reveal, setReveal] = useState(false)
  const fields = [
    {
      label: '名稱',
      type: 'text',
      name: 'name',
      placeholder: '使用者名稱',
    },
    {
      label: '帳號',
      type: 'text',
      name: 'email',
      placeholder: '帳號',
    },
    {
      label: '密碼',
      type: 'password',
      name: 'password',
      placeholder: '密碼',
    },
    {
      label: '確認密碼',
      type: 'password',
      name: 'confirm',
      placeholder: '確認密碼',
    },
  ]
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const onDataChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }
  const handleLogin = async () => {
    if (data.confirm !== data.password) {
      setToast({ show: true, text: '註冊失敗，請確認兩次密碼是否相同' })
    } else {
      const { token } = await apiServices.register(data)
      if (!token) {
        setToast({ show: true, text: '註冊失敗，email已被使用' })
      } else {
        setToast({ show: true, text: '註冊成功' })
        document.cookie = `token=${token}; Domain=${window.location.hostname}; Path=/;`
        const { user } = await apiServices.me()
        setAuth({
          authed: true,
          ...user,
        })
        navigate('/')
      }
    }
  }
  return (
    <Container className="bg-dots-light h-100 w-100 d-flex flex-column">
      <div className="d-flex" style={{ height: '65%' }}>
        <Image
          className="mt-auto mx-auto"
          src={logoFull}
          style={{ height: '25rem', width: 'auto' }}
        />
      </div>
      <div className="d-flex w-100 mb-auto" style={{ height: '35%' }}>
        <Form className="pb-3 px-5 mx-auto d-flex flex-column">
          {fields.map((field) => (
            <Form.Group key={field.name} className="d-flex mb-2">
              {/* <Form.Label>{field.label}</Form.Label> */}
              {field.type === 'password' ? (
                <InputGroup
                  id="defaultBorder"
                  className="rounded input-group-transparent-addon w-100"
                >
                  <Form.Control
                    name={field.name}
                    type={reveal ? 'text' : field.type}
                    onChange={onDataChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.isComposing) handleLogin()
                    }}
                    placeholder={field.placeholder}
                  />
                  <InputGroup.Text>
                    <FontAwesomeIcon
                      className="fs-6"
                      style={{
                        right: '10',
                        top: '50',
                        bottom: '50',
                        cursor: 'pointer',
                      }}
                      title={reveal ? '點擊以隱藏密碼' : '點擊以顯示密碼'}
                      icon={reveal ? faEye : faEyeSlash}
                      onClick={() => setReveal(!reveal)}
                    />
                  </InputGroup.Text>
                </InputGroup>
              ) : (
                <Form.Control
                  name={field.name}
                  type={field.type}
                  onChange={onDataChange}
                  placeholder={field.placeholder}
                />
              )}
            </Form.Group>
          ))}
          <LoadingButton
            className="mx-auto my-2"
            variant="outline-wom"
            onClick={handleLogin}
            disabled={
              !data.name || !data.confirm || !data.email || !data.password
            }
            btnText="註冊"
          />
          <div className="d-flex justify-content-center small">
            已有帳號？
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => navigate('/')}
              aria-hidden
            >
              登入
            </span>
          </div>
        </Form>
      </div>
    </Container>
  )
}

export default Register
