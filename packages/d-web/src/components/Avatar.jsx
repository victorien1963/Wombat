import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './ContextProvider'

function Avatar() {
  const { auth } = useContext(AuthContext)
  if (auth.notexist) console.log(auth)
  return (
    <div className="w-100 h-100 d-flex">
      <FontAwesomeIcon
        className="m-auto h1 h-100 w-100 text-wom"
        icon={faUserCircle}
        title="頭 像"
      />
    </div>
  )
}

export default Avatar
