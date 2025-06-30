import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SettingsPage from '../components/SettingsPage'
import StickyBar from '../components/StickyBar'

function Settings() {
  return (
    <div className='bg-[#f5f5f7]'>
      <div className='h-[100dvh] relative'>
        <Navbar />

        <SettingsPage />

        <div className="sticky w-full bottom-0 z-40">
          <StickyBar />
        </div>
        <Footer />
      </div>

    </div>
  )
}

export default Settings
