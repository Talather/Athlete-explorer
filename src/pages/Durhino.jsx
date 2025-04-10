import DurinhoPage from '../components/Durinho'
import Footer from '../components/Footer'
import StickyBar from '../components/StickyBar'
import '../styles/durhino.css'

function Durhino () {
  return (
    <div className='App bg-[#f5f5f7]'>
      <DurinhoPage />
      <StickyBar />
      <Footer />
      
    </div>
  )
}

export default Durhino
