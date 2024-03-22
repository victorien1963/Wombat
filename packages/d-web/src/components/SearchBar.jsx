import React, { useState } from 'react'
import PropTypes from 'prop-types'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function Searchbar(props) {
  const { setting } = props
  const { id, size, extraClass, title, action, method } = setting
  const [focus, setFocus] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <InputGroup
      id={id}
      className={`px-0 py-1 searchBar${extraClass || ''}`}
      size={size}
    >
      <FormControl
        placeholder={title}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.nativeEvent.isComposing &&
            focus
          ) {
            setSearch('')
            method(search)
          }
        }}
      />
      <Button
        variant="outline-wom"
        id="button-addon2"
        title="搜 尋"
        onClick={() => {
          setSearch('')
          method(search)
        }}
      >
        {action || <FontAwesomeIcon icon={faSearch} />}
      </Button>
    </InputGroup>
  )
}

Searchbar.propTypes = {
  setting: PropTypes.shape().isRequired,
}

export default Searchbar
