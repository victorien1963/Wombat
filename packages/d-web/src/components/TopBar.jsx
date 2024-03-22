/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useMemo, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import {
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  ButtonGroup,
} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCirclePlus,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons'
import { SocketContext, AuthContext, DraftContext } from './ContextProvider'

function PromptOptions({ setting }) {
  const { searchTargets } = setting
  const location = useLocation()

  const { auth } = useContext(AuthContext)
  const { draftId, module1, module2, module3, module4 } =
    useContext(DraftContext)
  const modules = {
    '/Module1': module1,
    '/Module2': module2,
    '/Module3': module3,
    '/Module4': module4,
  }

  const pathnameConverter = {
    '/Module1': '/Module1',
    '/Module2': '/Module2',
    '/Module3': '/Module4',
    '/Module4': '/Module3',
  }

  const records = useMemo(() => {
    if (!auth.setting.records) return []
    return auth.setting.records.filter(
      ({ module }) => module === location.pathname
    )
  }, [auth.setting.records, location.pathname])

  const [data, setData] = useState({
    draftId,
  })
  useEffect(() => {
    const options = searchTargets[location.pathname]
    if (!options) return
    setData(
      options.reduce(
        (prev, { name }, i) => ({
          ...prev,
          [name]: modules[pathnameConverter[location.pathname]]
            ? modules[pathnameConverter[location.pathname]][name]
            : '',
          [`field${i}Selections`]: [],
        }),
        {
          draftId,
        }
      )
    )
  }, [location.pathname])

  const handleDataChange = (e) =>
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))

  const typeaheadRef = useRef(null)
  return (
    <Row>
      {searchTargets[location.pathname] ? (
        searchTargets[location.pathname].map(
          ({ label, name, placeholder, method, xs }) => (
            <Col xs={xs} key={name}>
              <InputGroup className="px-0 py-1 searchBar flex-nowrap">
                {label && (
                  <Form.Label className="my-auto px-2 text-nowrap">
                    {label}
                  </Form.Label>
                )}
                <Typeahead
                  ref={method ? typeaheadRef : null}
                  id="basic-typeahead-single"
                  labelKey="name"
                  name={name}
                  placeholder={placeholder}
                  onInputChange={(text) => {
                    handleDataChange({
                      target: {
                        name,
                        value: text,
                      },
                    })
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.nativeEvent.isComposing &&
                      Object.keys(data).every((key) => data[key]) &&
                      method
                    ) {
                      if (typeaheadRef.current) {
                        const { state } = typeaheadRef.current
                        if (!state.showMenu) method(data)
                        else if (!state.activeItem) method(data)
                      }
                    }
                  }}
                  onChange={(e) => {
                    handleDataChange({
                      target: {
                        name,
                        value: e[0],
                      },
                    })
                  }}
                  options={Array.from(
                    new Set(
                      records
                        .filter(({ field }) => field === name)
                        .map(({ value }) => value || '')
                    )
                  )}
                  selected={
                    Array.from(
                      new Set(
                        records
                          .filter(({ field }) => field === name)
                          .map(({ value }) => value || '')
                      )
                    ).includes(data[name])
                      ? [data[name]]
                      : []
                  }
                />
                {/* <Form.Control
                className="rounded-start"
                name={name}
                value={data[name] || ''}
                onChange={handleDataChange}
              /> */}
                {method && (
                  <Button
                    variant="outline-dai"
                    id="button-addon2"
                    title="搜 尋"
                    onClick={() => {
                      method(data)
                    }}
                    disabled={Object.keys(data).some((key) => !data[key])}
                  >
                    Create&ensp;
                    <FontAwesomeIcon icon={faCirclePlus} />
                  </Button>
                )}
              </InputGroup>
            </Col>
          )
        )
      ) : (
        <Col />
      )}
    </Row>
  )
}

function TopBar() {
  const { sendMessage } = useContext(SocketContext)
  const { draftId, model, handleModelChange, cursor, history, handleRecover } =
    useContext(DraftContext)

  const searchTargets = {
    '/Module1': [
      {
        label: '產品/服務',
        name: 'option1',
        placeholder: '超跑',
      },
      {
        label: '地區',
        name: 'option2',
        placeholder: '美國',
        method: (value) => sendMessage('module1', value),
      },
    ],
    '/Module2': [
      {
        label: '產品/服務',
        name: 'option1',
        placeholder: '超跑',
      },
      {
        label: '地區',
        name: 'option2',
        placeholder: '美國',
        method: (value) => sendMessage('module2', value),
      },
    ],
    '/Module4': [
      {
        label: '角色/職業',
        name: 'option1',
        placeholder: '工程師',
        // xs: '4',
      },
      {
        label: '外型與穿著',
        name: 'option2',
        placeholder: '西裝',
        method: (value) => sendMessage('module3', value),
        // xs: '4',
      },
    ],
    '/Module3': [
      {
        name: 'option1',
        label: '角色/職業',
        placeholder: '國安局特工',
      },
      {
        name: 'option2',
        label: '任務',
        placeholder: ' 國家機密資料保存與維護',
        method: (value) => sendMessage('module4', { ...value, draftId }),
      },
    ],
  }
  return (
    <Row className="w-100 h-100 d-flex flex-nowrap py-2">
      <div className="w-60 h-100 d-flex flex-column justify-content-center">
        <PromptOptions
          setting={{
            searchTargets,
          }}
        />
      </div>

      <div className="w-20 h-100 d-flex flex-column justify-content-center py-1">
        <ButtonGroup className="w-100 h-100" aria-label="Basic">
          <Button
            // disabled={model === 'gpt-3.5-turbo'}
            onClick={() => handleModelChange('gpt-3.5-turbo')}
            className="w-50 text-dai d-flex"
            variant="outline-dai"
            style={{
              height: '94%',
            }}
            size="sm"
            active={model === 'gpt-3.5-turbo'}
          >
            <span className="fw-bold fs-6 m-auto">GPT-3</span>
          </Button>
          <Button
            // disabled={model === 'gpt-4'}
            onClick={() => handleModelChange('gpt-4')}
            className="w-50 text-dai d-flex"
            variant="outline-dai"
            style={{
              height: '94%',
            }}
            size="sm"
            active={model === 'gpt-4'}
          >
            <span className="fw-bold fs-6 m-auto">GPT-4</span>
          </Button>
        </ButtonGroup>
      </div>
      <div className="w-20 h-100 d-flex flex-column justify-content-center py-1">
        <ButtonGroup className="w-100 h-100" aria-label="Basic">
          <Button
            disabled={!cursor}
            onClick={() => handleRecover(cursor - 1)}
            className="w-50 text-dai d-flex py-2"
            style={{
              height: '94%',
              border: '1px solid #0a004e',
            }}
            variant="light"
            size="sm"
          >
            <FontAwesomeIcon
              className="m-auto text-dai w-100"
              icon={faRotateLeft}
              title="復原"
            />
          </Button>
          <Button
            disabled={cursor === history.length - 1}
            onClick={() => handleRecover(cursor + 1)}
            className="w-50 text-dai d-flex py-2"
            style={{
              height: '94%',
              border: '1px solid #0a004e',
            }}
            variant="light"
            size="sm"
          >
            <FontAwesomeIcon
              className="m-auto text-dai w-100"
              icon={faRotateRight}
              title="取消復原"
            />
          </Button>
        </ButtonGroup>
      </div>
    </Row>
  )
}

PromptOptions.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default TopBar
