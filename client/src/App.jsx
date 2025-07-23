import { useState } from 'react'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Login from './pages/Login'
import Files from './pages/Files'
import Upload from './pages/Upload'

function Home(){
  return(
    <div className='rounded-xl bg-gray-900/50 p-5 cursor-pointer hover:scale-110 transition-all duration-100'>
      <h1>Hello</h1>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex flex-col text-4xl font-satoshi font-extrabold items-center min-h-screen w-screen overflow-hidden bg-gradient-to-bl from-black to-gray-950 text-gray-200 select-none'>
      <Router>
        <div className='w-70/100'>
          <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/files' element={<Files/>}></Route>
            <Route path='/upload' element={<Upload/>}></Route>
          </Routes>
        </div>
        
      </Router>
    </div>
  )
}

export default App
