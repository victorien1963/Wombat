import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDownload,
  faTrashCan,
  faUpload,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import apiServices from '../services/apiServices'

function VideoWithFunc({ setting }) {
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

  return (
    <div
      className="position-relative w-100 imgHover"
      style={{
        width: scale,
        height: scale,
      }}
    >
      {!src || !src[0] ? (
        <div className="w-100 h-100 d-flex">
          <FontAwesomeIcon
            icon={faVideo}
            className="text-dai-white h-25 m-auto"
          />
        </div>
      ) : (
        <video
          className="my-auto"
          width="100%"
          height="auto"
          style={{
            maxHeight,
          }}
          controls
        >
          <track kind="captions" />
          <source src={src} />
        </video>
      )}
      {scale !== '0%' && (
        <div
          className="h-100 w-100 position-absolute d-flex funsHover"
          style={{
            top: '0%',
            left: '0%',
            // pointerEvents: 'none',
          }}
          onClick={handlePicSelect}
          aria-hidden
        >
          <Button
            variant="btn-dai text-light m-auto"
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
              console.log(e)
              setuploading(e.target.files[0])
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
            variant="btn-dai text-light m-auto"
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
            variant="btn-dai text-light m-auto"
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
  )
}

VideoWithFunc.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default VideoWithFunc
