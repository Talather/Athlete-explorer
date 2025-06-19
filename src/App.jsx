import { Routes, Route } from 'react-router-dom'
import { ThirdwebProvider } from "thirdweb/react"
import Home from './pages/home'
import Durhino from './pages/Durhino'
import Settings from './pages/Settings'
import FAQ from './pages/FAQ'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Cookies from './pages/Cookies'
import AdminStaticPages from './pages/AdminStaticPages'
import './index.css'
import RightSidebar from './components/durhino_siderbar/code'

function App () {
  return (
    <ThirdwebProvider  >
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page' element={<Durhino />} />
        <Route path='/k' element={<RightSidebar />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/cookies' element={<Cookies />} />
        <Route path='/admin/static-pages' element={<AdminStaticPages />} />
      </Routes>
    </ThirdwebProvider>
  )
}

export default App;
