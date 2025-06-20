import { useEffect } from 'react'
import { FaXTwitter, FaInstagram, FaDiscord } from 'react-icons/fa6'

function Footer() {
  useEffect(() => {
    const yearEl = document.getElementById('year')
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear()
    }
  }, [])

  return (
    <div className='bg-[#eee] px-[47px] py-[14px] flex flex-col items-center gap-10'>
      
      <div className='w-full grid place-items-center lg:place-items-start grid-cols-1 lg:grid-cols-3 gap-2'>
        <a href="https://twitter.com/fansdayofficial" target="_blank" class="social-link w-inline-block">
          <svg className='size-[20px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none"><script xmlns="" id="nimlmejbmnecnaghgmbahmbaddhjbecg" /><script xmlns="" /><script xmlns="" /><script xmlns="" />
            <path d="M459.37 151.716C459.695 156.264 459.695 160.813 459.695 165.361C459.695 304.081 354.112 463.919 161.137 463.919C101.685 463.919 46.457 446.7 0 416.813C8.447 417.787 16.568 418.112 25.34 418.112C74.395 418.112 119.553 401.544 155.614 373.28C109.482 372.305 70.822 342.092 57.502 300.508C64 301.482 70.497 302.132 77.32 302.132C86.741 302.132 96.163 300.832 104.934 298.559C56.853 288.812 20.791 246.579 20.791 195.574V194.275C34.76 202.072 51.005 206.945 68.222 207.594C39.958 188.751 21.441 156.589 21.441 120.203C21.441 100.711 26.638 82.843 35.735 67.249C87.39 130.924 165.035 172.507 252.1 177.056C250.476 169.259 249.501 161.138 249.501 153.016C249.501 95.188 296.283 48.082 354.435 48.082C384.648 48.082 411.937 60.752 431.105 81.219C454.82 76.671 477.561 67.899 497.704 55.879C489.906 80.245 473.338 100.712 451.572 113.706C472.689 111.433 493.156 105.584 511.998 97.463C497.706 118.254 479.837 136.771 459.37 151.716Z" fill="#1D1D1F" />
            <script xmlns="" /></svg>
        </a>

        <div className='w-full flex justify-center'>
          <p class="text-center font-bold text-[19px]">Every day is a fan's day</p>
        </div>

        <div className='flex justify-center flex-col sm:flex-row lg:justify-end gap-2 sm:gap-5 xl:gap-10 w-full'>
          <a href="/terms" class="text-lg text-center whitespace-nowrap">
            Terms and Conditions
          </a>
          <a href="/privacy" class="text-lg text-center whitespace-nowrap">
            Privacy Policy
          </a>
        </div>

      </div>


      <div class="text-sm">
        © 2025 FansDay | All rights reserved
      </div>

    </div>
  )
}

export default Footer
