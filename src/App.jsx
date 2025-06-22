import { Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from "thirdweb/react"
import Home from './pages/home'
import Durhino from './pages/Durhino'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Profile from './pages/Profile'
import CookiesModal from './components/CookiesModal'
import './index.css'
import { useWeglot } from 'react-weglot';

// import { useEffect } from 'react'

function App () {
  const [lang, setLang] = useWeglot('wg_67a51291b7ddd7a6965fae7d503730df2', 'es');

  
  return (
    <ThirdwebProvider  >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Durhino />} />
        {/* <Route path='/k' element={<RightSidebar />} /> */}
        <Route path='/settings' element={<Settings />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <CookiesModal />
    </ThirdwebProvider>
  )
}

export default App;
