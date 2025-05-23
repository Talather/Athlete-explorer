import DurinhoPage from '../components/Durinho'
import Footer from '../components/Footer'
import StickyBar from '../components/StickyBar'
import '../styles/durhino.css'

function Durhino () {
  return (
    <div className='App bg-[#f5f5f7]'>
      <div className='h-[100dvh] relative'>
        <DurinhoPage />
        <div className="sticky w-full bottom-0 z-40">
            <StickyBar />
          </div>
        <Footer />
      </div>
      
    </div>
  )
}

export default Durhino
