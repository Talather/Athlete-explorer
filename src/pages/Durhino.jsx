import Footer from '../components/durhinoFooter'
import DurinhoPage from '../components/Durinho'
import StickyBar from '../components/StickyBar'
import '../styles/durhino.css'

function Durhino () {
  return (
    <div className='App bg-[#f5f5f7]'>
      <DurinhoPage />
      <StickyBar />
      <div style={{marginBottom:"20px"}}>
          <Footer />
        </div>
    </div>
  )
}

export default Durhino
