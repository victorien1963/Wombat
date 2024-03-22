/* eslint-disable no-promise-executor-return */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Image, Form, Card, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faTrashCan,
  faUpload,
  faImage,
} from '@fortawesome/free-solid-svg-icons'
import apiServices from '../services/apiServices'

function ImgWithFunc({ setting }) {
  const {
    id = 'file',
    scale = '100%',
    src,
    handlePicSelect = () => {},
    handlePicChange = () => {},
    maxHeight,
  } = setting

  const [uploading, setuploading] = useState(null)
  useEffect(() => {
    const uploadImg = async () => {
      const getArrayBuffer = (files) =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            resolve(reader.result)
          })
          reader.readAsArrayBuffer(files)
        })
      const files = []
      files.push(getArrayBuffer(uploading))

      const buffered = await Promise.all(files)
      const arrayed = buffered.map((buffer) => ({
        name: uploading.name,
        data: Array.from(new Uint8Array(buffer)),
      }))
      const res = await apiServices.data({
        path: `draft/image`,
        method: 'post',
        data: {
          files: JSON.stringify(arrayed),
        },
      })
      if (!res.error) handlePicChange(`/api/draft/image/${res[0].name}`)
      setuploading(null)
    }
    if (uploading) uploadImg()
  }, [uploading])

  const [imgState, setimgState] = useState(false)
  const getImage = async (imgSrc) => {
    const img = await apiServices.data({
      path: imgSrc.replace('/api/', ''),
      method: 'get',
    })
    if (img === 'PENDING') {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      await delay(3000)
      getImage(imgSrc)
    } else {
      setimgState(true)
    }
  }
  useEffect(() => {
    if (!src.includes('imagejob')) {
      setimgState(true)
      return
    }
    setimgState(false)
    getImage(src)
  }, [src])

  return (
    <div
      className="position-relative my-auto d-flex"
      style={{
        width: scale,
        height: scale,
      }}
    >
      {!src || !src[0] ? (
        <div className="position-relative imgHover w-100 h-100 d-flex">
          <FontAwesomeIcon
            icon={faImage}
            className="text-wom-white h-25 m-auto"
          />
          <div
              className="h-100 w-100 position-absolute d-flex funsHover"
              style={{
                top: '0%',
                left: '0',
                // pointerEvents: 'none',
              }}
              onClick={handlePicSelect}
              aria-hidden
            >
              <Button
                variant="btn-wom text-light m-auto"
                title="上傳"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Form.Label className="m-auto" htmlFor={id}>
                  <FontAwesomeIcon icon={faUpload} />
                </Form.Label>
              </Button>
              <Form.Control
                id={id}
                name="file"
                type="file"
                onChange={(e) => {
                  setuploading(e.target.files[0])
                  e.target.value = ''
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="p-0 m-0 border-0"
                style={{
                  visibility: 'hidden',
                  width: '0px',
                  height: '0px',
                }}
              />
              <Button
                variant="btn-wom text-light m-auto"
                title="刪除"
                onClick={(e) => {
                  handlePicChange('')
                  e.stopPropagation()
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
              <Button
                title="下載"
                variant="btn-wom text-light m-auto"
                href={src}
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <div
                className="w-100 h-100 position-absolute"
                style={{
                  zIndex: '1',
                  backgroundColor: 'black',
                  opacity: '0.5',
                  pointerEvents: 'none',
                }}
              />
            </div>
        </div>
      ) : (
        <div className={`position-relative d-flex imgHover overflow-hidden m-auto ${imgState ? '' : 'h-100'}`} style={{
          maxWidth: '99%',
          maxHeight: '99%',
          minHeight: '99%',
          minWidth: '99%',
        }}>
          {imgState ? (
            <Image
              className='m-auto'
              style={{
                height: 'auto',
                maxHeight,
                maxWidth: '100%',
              }}
              src={src}
              alt="圖片失效"
            />
          ) : (
            <Card className='h-100 w-100 d-flex'>
              <div className='d-flex flex-column m-auto'>
                <Spinner size="sm" className='mx-auto' />
                <span className='ms-1 mx-auto'>圖片生成中</span>
              </div>
            </Card>
          )}
          {scale !== '0%' && (
            <div
              className="h-100 w-100 position-absolute d-flex funsHover"
              style={{
                top: '0%',
                left: '0',
                // pointerEvents: 'none',
              }}
              onClick={handlePicSelect}
              aria-hidden
            >
              <Button
                variant="btn-wom text-light m-auto"
                title="上傳"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Form.Label className="m-auto" htmlFor={id}>
                  <FontAwesomeIcon icon={faUpload} />
                </Form.Label>
              </Button>
              <Form.Control
                id={id}
                name="file"
                type="file"
                onChange={(e) => {
                  setuploading(e.target.files[0])
                  e.target.value = ''
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="p-0 m-0 border-0"
                style={{
                  visibility: 'hidden',
                  width: '0px',
                  height: '0px',
                }}
              />
              <Button
                variant="btn-wom text-light m-auto"
                title="刪除"
                onClick={(e) => {
                  handlePicChange('')
                  e.stopPropagation()
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
              <Button
                title="下載"
                variant="btn-wom text-light m-auto"
                href={src}
                target="_blank"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </Button>
              <div
                className="w-100 h-100 position-absolute"
                style={{
                  zIndex: '1',
                  backgroundColor: 'black',
                  opacity: '0.5',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

ImgWithFunc.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default ImgWithFunc
