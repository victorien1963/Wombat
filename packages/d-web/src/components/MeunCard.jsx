import React, { useContext } from 'react'
// import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Avatar from './Avatar'
import { AuthContext } from './ContextProvider'

function MenuCard() {
  const { auth } = useContext(AuthContext)
  return (
    <Card className="text-center h-100 p-0 border-0" style={{ width: '350px' }}>
      <Card.Body className="h-100 d-flex flex-column">
        <div
          className="py-3"
          style={{
            height: '150px',
          }}
        >
          <Avatar />
        </div>
        <Card.Title>{auth.name || 'VIP'}</Card.Title>
        <Card.Title>{auth.email}</Card.Title>
      </Card.Body>
      {/* <Card.Footer className="d-flex justify-content-around">
        <Link to="/info" className="align-item-start">
          <Button variant="outline-wom">修 改 密 碼</Button>
        </Link>
      </Card.Footer> */}
    </Card>
  )
}

export default MenuCard
