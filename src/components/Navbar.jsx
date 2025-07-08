import { Link } from "react-router-dom"
import { ConnectButton } from "thirdweb/react";
import { client } from '../client';
import { useProfiles, useActiveWallet } from "thirdweb/react";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { User, Settings } from 'lucide-react';

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "phone", "discord", "facebook"],
    },
  }),
];

function Navbar() {
  const { data: profiles } = useProfiles({
    client,
  });
  const wallet = useActiveWallet();
  const [change,setChange] = useState(0);
  
  // Get athletes from Redux store
  const { athletes } = useSelector(state => state.athletes);

  const contracts = new Set(athletes?.map(athlete => athlete.nftContractAddress !== null ? athlete.nftContractAddress : "0x683Fb845548d161A9cAddedEDf46FcbB713FEB22"));
  useEffect(() => {
    const buttons = document.querySelectorAll('.css-86pfay');
    const buttons2 = document.querySelectorAll('.css-1j66weo');
    const buttons3 = document.querySelectorAll('.css-86pfay');

    buttons2.forEach((btn) => {
      if (btn.innerText === 'Buy' || btn.innerText === 'Send' || btn.innerText === 'Receive'  ) {
        btn.style.display = 'none';
      }
    });
    buttons3.forEach((btn) => {
      if (btn.innerText === 'Transactions' || btn.innerText === 'View Assets' ) {
        btn.style.display = 'none';
      }
    });
    buttons.forEach((btn) => {
      const span = btn.querySelector('span');
      if (span && span.textContent.trim() === 'Connect an App') {
        btn.style.display = 'none';
      }
    });
  }, [profiles,change]);

  function generateRandomUsername() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const suffix = Array.from({ length: 11 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${suffix}`;
    
  }
  const detectLocationDefaults = async () => {
    try {
      // Use IP geolocation service to detect country
      const response = await fetch('https://ipapi.co/json/');
      console.log(response);
      const locationData = await response.json();
      console.log(locationData);
      const countryCode = locationData.country_code?.toUpperCase();
      console.log(countryCode);

      console.log('Detected country:', countryCode);

      // Set language and currency based on country
      let language = 'en'; // Default to English
      let currency = 'USD'; // Default to USD

      switch (countryCode) {
        case 'TR': // Turkey
          language = 'tr';
          currency = 'TRY';
          break;
        case 'GB': // United Kingdom
          language = 'en';
          currency = 'GBP';
          break;
        case 'US': // United States
          language = 'en';
          currency = 'USD';
          break;
        // European Union countries
        case 'DE': case 'FR': case 'IT': case 'ES': case 'NL': 
        case 'BE': case 'AT': case 'PT': case 'IE': case 'FI':
        case 'LU': case 'SI': case 'SK': case 'EE': case 'LV':
        case 'LT': case 'CY': case 'MT': case 'GR':
          language = 'en';
          currency = 'EUR';
          break;
        case 'BR': // Brazil
          language = 'pt';
          currency = 'BRL';
          break;
        case 'KR': // South Korea
          language = 'ko';
          currency = 'KRW';
          break;
        case 'JP': // Japan
          language = 'ja';
          currency = 'JPY';
          break;
        default:
          // For all other countries, keep English and USD
          language = 'en';
          currency = 'USD';
      }

      return { language, currency, country: countryCode };
    } catch (error) {
      console.error('Error detecting location:', error);
      // Fallback to defaults
      return { language: 'en', currency: 'USD', country: null };
    }
  };


  const saveUser = async () => {
    try {
      if (!profiles || profiles.length === 0) return;
      
      const userId = profiles[0]?.details.id;
      const userEmail = profiles[0]?.details.email;
      const username = profiles[0]?.details.name? profiles[0]?.details.name : generateRandomUsername();
      
    
      if (!userId || !userEmail) return;

      // Detect user's country and set defaults
      const detectLocationDefaults = async () => {
        try {
          // Use IP geolocation service to detect country
          const response = await fetch('https://ipapi.co/json/');
          console.log(response);
          const locationData = await response.json();
          console.log(locationData);
          const countryCode = locationData.country_code?.toUpperCase();
          console.log(countryCode);

          console.log('Detected country:', countryCode);

          // Set language and currency based on country
          let language = 'en'; // Default to English
          let currency = 'USD'; // Default to USD

          switch (countryCode) {
            case 'TR': // Turkey
              language = 'tr';
              currency = 'TRY';
              break;
            case 'GB': // United Kingdom
              language = 'en';
              currency = 'GBP';
              break;
            case 'US': // United States
              language = 'en';
              currency = 'USD';
              break;
            // European Union countries
            case 'DE': case 'FR': case 'IT': case 'ES': case 'NL': 
            case 'BE': case 'AT': case 'PT': case 'IE': case 'FI':
            case 'LU': case 'SI': case 'SK': case 'EE': case 'LV':
            case 'LT': case 'CY': case 'MT': case 'GR':
              language = 'en';
              currency = 'EUR';
              break;
            case 'BR': // Brazil
              language = 'pt';
              currency = 'BRL';
              break;
            case 'KR': // South Korea
              language = 'ko';
              currency = 'KRW';
              break;
            case 'JP': // Japan
              language = 'ja';
              currency = 'JPY';
              break;
            default:
              // For all other countries, keep English and USD
              language = 'en';
              currency = 'USD';
          }

          return { language, currency, country: countryCode };
        } catch (error) {
          console.error('Error detecting location:', error);
          // Fallback to defaults
          return { language: 'en', currency: 'USD', country: null };
        }
      };

      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking user:', fetchError);
        return;
      }

      // Only save if user doesn't exist
      if (!existingUser) {
        // Detect location and set defaults
        const { language, currency, country } = await detectLocationDefaults();

        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              id: userId, 
              email: userEmail, 
              username: username,
              language: language,
              currency: currency,
            }
          ]);

        if (insertError) {
          console.error('Error saving user:', insertError);
        } else {
          console.log('User saved successfully with defaults:', { language, currency, country });
        }
      } else {
        console.log('User already exists');
      }
    } catch (error) {
      console.error('Error in saveUser function:', error);
    }
  };
   
  useEffect(() => {
    if (profiles && profiles.length > 0 ) {
      saveUser();
      setInterval(()=>{
        setChange((prev)=>prev+1);
      },100)
    }  
  }, [profiles]);
 
  return (
    <div className='navbar shadow-md'>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 justify-between px-4 py-[10px] relative'>

        <div className="hidden sm:block"></div>

        <div className="flex justify-start sm:justify-center">
          <a href="/" className="inline-block">
              <img sizes="auto" alt="Logo" className="size-[60px] object-cover
                sm:size-[80px] sm:px-[10px] sm:py-[7.5px]" src="/sixer.gif"/>
          </a>
        </div>
        
        <div className="flex justify-end">
          <div className="flex items-center space-x-3">
            {/* Profile & Settings Links - Show when wallet is connected */}
            {/* {wallet && (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-white"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-white"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </>
            )} */}
            
            <div className="primary-gradient rounded-[10px] p-0.5 overflow-hidden">
              <ConnectButton 
                client={client}
                connectButton={{
                  label: "Login / Signup",
                }}
                // buttonTitle="Link Your Wallet"
                // theme="light"
                modalSize="wide"
                autoConnect={true}
                wallets={wallets}
                connectModal={{
                  showThirdwebBranding:false,
                }}
                onConnect={(profile)=>{
                  setChange((prev)=>prev+1);
                  saveUser();
                }}
                theme={"light"}

                detailsModal={{
                  assetTabs: ["token","nft"],
                }}
                chain={sepolia}                                                  
                // supportedNFTs={athletes && athletes.length > 0 
                //   ? athletes
                //     .filter(athlete => athlete.nftContractAddress) 
                //     .map(athlete => athlete.nftContractAddress)
                //   : ["0x4d5a9F4e440e288E68d9E796AAeb1E968B79B321"]} 

                supportedNFTs={[...contracts]}
                
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar
