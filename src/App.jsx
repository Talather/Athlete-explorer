import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Durhino from './pages/Durhino'
import './index.css'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/page' element={<Durhino />} />
    </Routes>
  )
}

export default App
