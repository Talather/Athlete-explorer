import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SettingsPage from '../components/SettingsPage'
import StickyBar from '../components/StickyBar'
import SEO from '../components/SEO'
function Settings() {
  return (
    <div className='bg-[#f5f5f7]'>
       <SEO
        title="Account Settings"
        description="Update your account details, wallet settings, and notification preferences for a smoother fan experience."
        robots="noindex, nofollow"
        canonical="https://fansday.com/settings"
        ogTitle="Account Settings - Fansday"
        ogDescription="Manage your account, security, and notifications."
        ogImage="https://fansday.com/assets/og.png"
        twitterCard="summary_large_image"
      />
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
