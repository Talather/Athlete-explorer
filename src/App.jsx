import { Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from "thirdweb/react"
import Home from './pages/home'
import Durhino from './pages/Durhino'
import './index.css'
import RightSidebar from './components/durhino_siderbar/code'

function App () {
  return (
    <ThirdwebProvider >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Durhino />} />
        <Route path='/k' element={<RightSidebar />} />
      </Routes>
    </ThirdwebProvider>
  )
}

export default App;
