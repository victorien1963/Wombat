/* eslint-disable prefer-destructuring */
import React, { useContext, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, DropdownButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { AuthContext, DraftContext } from './ContextProvider'
import Avatar from './Avatar'
import MenuCard from './MeunCard'
import fileFuncs from '../services/file'

function SideNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth, setAuth } = useContext(AuthContext)

  const isInDraft = useMemo(
    () =>
      ['/Module1', '/Module2', '/Module3', '/Module4'].includes(
        location.pathname
      ),
    [location]
  )
  const locationNames = {
    '/Module1': 'module1',
    '/Module2': 'module2',
    '/Module3': 'module4',
    '/Module4': 'module3',
  }

  const ref = useRef(null)

  const { module1, module2, module3, module4, draftId, setDraft, setDraftId } =
    useContext(DraftContext)
  const handleCsvUpload = () => {
    if (!ref.current) return
    setDraft(
      {
        [locationNames[location.pathname]]: {
          generating: true,
          step: '上傳檔案中',
        },
      },
      draftId
    )
    fileFuncs.readFile(
      ref.current.files[0],
      [locationNames[location.pathname]],
      (res) => {
        setDraft(
          {
            [locationNames[location.pathname]]: {
              ...res[locationNames[location.pathname]],
              generating: false,
              step: '',
            },
          },
          draftId
        )
      }
    )
  }

  return (
    <div
      className="w-100 h-100 d-flex flex-column border py-3 ps-2"
      style={{
        backgroundColor: '#eeeeee',
      }}
    >
      <div className="h-15 mb-4">
        <DropdownButton
          id="dropdown-button-drop-end"
          drop="end"
          className="h-100 w-100"
          title={
            <div className="text-wom fw-bolder pt-3">
              <div
                style={{
                  height: '50px',
                }}
              >
                <Avatar />
              </div>
              {auth.name}
            </div>
          }
        >
          <MenuCard />
        </DropdownButton>
      </div>
      {isInDraft && (
        <>
          {[
            { label: 'PESTEL', link: '/Module1' },
            { label: '競品分析', link: '/Module2' },
            { label: '顧客旅程', link: '/Module3' },
            { label: '人物誌', link: '/Module4' },
          ].map(({ label, link }) => (
            <Button
              key={link}
              active={location.pathname === link}
              onClick={() => navigate(link)}
              className="w-75 mx-auto my-2"
              variant="outline-wom"
              size="sm"
            >
              {label}
            </Button>
          ))}
          <Button
            onClick={() => setDraftId('')}
            className="w-75 mx-auto my-2"
            variant="outline-wom"
            size="sm"
          >
            <FontAwesomeIcon icon={faReply} />
            &ensp;專案列表
          </Button>
          <Button
            onClick={() => ref.current.click()}
            className="w-75 mx-auto mb-2 mt-auto"
            variant="outline-wom"
            size="sm"
          >
            上傳檔案
          </Button>
          <input
            ref={ref}
            style={{
              visibility: 'hidden',
              width: '0',
              height: '0',
            }}
            type="file"
            id="xlsx"
            name="xlsx"
            accept=".xlsx"
            onChange={(e) => {
              handleCsvUpload(e)
              e.target.value = ''
            }}
          />
          <Button
            onClick={() =>
              fileFuncs.makeFile(
                {
                  module1,
                  module2,
                  module3,
                  module4,
                },
                [locationNames[location.pathname]],
                (downloadFunc) => downloadFunc()
              )
            }
            className="w-75 mx-auto my-2"
            variant="outline-wom"
            size="sm"
          >
            匯出檔案
          </Button>
          {/* <hr className="hrClass-dashed my-3" /> */}
        </>
      )}
      <Button
        onClick={() => {
          document.cookie = `token=; Domain=${window.location.hostname}; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          setAuth({
            authed: false,
          })
          window.location.replace('/')
        }}
        className={`w-75 mx-auto ${isInDraft ? '' : 'mt-auto'} my-2`}
        variant="outline-wom"
        size="sm"
      >
        登出
      </Button>
    </div>
  )
}

export default SideNavBar
