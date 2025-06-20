import { Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from "thirdweb/react"
import Home from './pages/home'
import Durhino from './pages/Durhino'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CookiesModal from './components/CookiesModal'
import './index.css'

function App () {
  return (
    <ThirdwebProvider  >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Durhino />} />
        {/* <Route path='/k' element={<RightSidebar />} /> */}
        <Route path='/settings' element={<Settings />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
      </Routes>
      <CookiesModal />
    </ThirdwebProvider>
  )
}

export default App;
