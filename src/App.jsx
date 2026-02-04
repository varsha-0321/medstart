
import './App.css'
import { Navbar, Container } from 'react-bootstrap'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Logo from './assets/logo.png'
import Direction from './components/Direction'
import Home from './components/Home'

function App() {
  return (
    <div>
      <Navbar style={{ borderBottom: '2px solid grey' }} className="bg-body-tertiary">
        <Container className='appcontainer'>
          <Navbar.Brand style={{ display: 'flex' }}>
            <img
              alt="logo"
              src={Logo}
              width="70"
              height="70"
            />
            <h1 style={{ fontSize: '3rem', marginLeft: '1rem', marginTop: '0.5rem' }}>
              MedStart
            </h1>
          </Navbar.Brand>
        </Container>
      </Navbar>

    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/direction" element={<Direction />} />
      </Routes>
    </div>
  )
}

export default App
