import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import {
  Home,
  Register,
  Module1,
  Module2,
  Module3,
  Module4,
  Book,
} from './pages'
import { AppWrapper, ContextProvider } from './components'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'

function App() {
  return (
    <div className="App">
      <Router>
        <ContextProvider>
          <AppWrapper>
            <Routes className="px-0">
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/book/:article_id" element={<Book />} />
              <Route path="/module1" element={<Module1 />} />
              <Route path="/module2" element={<Module2 />} />
              <Route path="/module3" element={<Module4 />} />
              <Route path="/module4" element={<Module3 />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </AppWrapper>
        </ContextProvider>
      </Router>
    </div>
  )
}

export default App
