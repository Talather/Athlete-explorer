import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Durhino from './pages/Durhino'
import './index.css'
import RightSidebar from './components/durhino_siderbar/code'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/page' element={<Durhino />} />
      <Route path='/k' element={<RightSidebar />} />
    </Routes>
  )
}

export default App
