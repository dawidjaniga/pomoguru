import React from 'react'
import logo from './logo.svg'
import './App.css'

function App () {
  return (
    <>
      <div className='header-arrow'></div>
      <div className='window'>
        <header className='toolbar toolbar-header'>
          <h1 className='title'>
            The Weather <span className='js-update-time'></span>
          </h1>
        </header>

        <div className='window-content'></div>
      </div>
    </>
  )
}

export default App
