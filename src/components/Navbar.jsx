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
  const [change, setChange] = useState(0);

  // Get athletes from Redux store
  const { athletes } = useSelector(state => state.athletes);

  const contracts = new Set(athletes?.map(athlete => athlete.nftContractAddress !== null ? athlete.nftContractAddress : "0x683Fb845548d161A9cAddedEDf46FcbB713FEB22"));
  useEffect(() => {
    const buttons = document.querySelectorAll('.css-86pfay');
    const buttons2 = document.querySelectorAll('.css-1j66weo');
    const buttons3 = document.querySelectorAll('.css-86pfay');

    buttons2.forEach((btn) => {
      if (btn.innerText === 'Buy' || btn.innerText === 'Send' || btn.innerText === 'Receive') {
        btn.style.display = 'none';
      }
    });
    buttons3.forEach((btn) => {
      if (btn.innerText === 'Transactions' || btn.innerText === 'View Assets') {
        btn.style.display = 'none';
      }
    });
    buttons.forEach((btn) => {
      const span = btn.querySelector('span');
      if (span && span.textContent.trim() === 'Connect an App') {
        btn.style.display = 'none';
      }
    });
  }, [profiles, change]);

  function generateRandomUsername() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const suffix = Array.from({ length: 11 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${suffix}`;

  }
 
  
  
  

  const saveUser = async () => {
    try {
      if (!profiles || profiles.length === 0) return;
     console.log("IM HERE");
      const userId = profiles[0]?.details.id;
      const userEmail = profiles[0]?.details.email ? profiles[0]?.details.email : "";
      const username = profiles[0]?.details.name ? profiles[0]?.details.name : generateRandomUsername();
      const phoneNo = profiles[0]?.details.phone ? profiles[0]?.details.phone : "";
      if (!userId ||  (!userEmail && !phoneNo)) return;

      // Detect user's country and set defaults
      async function detectLocationDefaults() {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2500);
      
          const res = await fetch("https://get.geojs.io/v1/ip/geo.json", { signal: controller.signal });
          console.log(res);
          clearTimeout(timeout);
          if (!res.ok) throw new Error(`GeoJS HTTP ${res.status}`);
      
          const data = await res.json();
          const cc = String(data.country_code || data.country || "").toUpperCase();
          console.log("this is real", cc);
          let language = "en";
          let currency = "USD";
      
          switch (cc) {
            case "TR": // Turkey
              language = "tr"; currency = "TRY"; break;
            case "GB": // United Kingdom
              language = "en"; currency = "GBP"; break;
            case "US": // United States
              language = "en"; currency = "USD"; break;
      
            // European Union countries (exactly as in your code)
            case "DE": case "FR": case "IT": case "ES": case "NL":
            case "BE": case "AT": case "PT": case "IE": case "FI":
            case "LU": case "SI": case "SK": case "EE": case "LV":
            case "LT": case "CY": case "MT": case "GR":
              language = "en"; currency = "EUR"; break;
      
            case "BR": // Brazil
              language = "pt"; currency = "BRL"; break;
            case "KR": // South Korea
              language = "ko"; currency = "KRW"; break;
            case "JP": // Japan
              language = "ja"; currency = "JPY"; break;
      
            default:
              language = "en"; currency = "USD";
          }
      
          return { language, currency, country: cc || null };
        } catch {
          // Fallback to defaults
          return { language: "en", currency: "USD", country: null };
        }
      }
      

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
      const { language, currency, country } = await detectLocationDefaults();
     console.log(language,currency,country)
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
              phone:phoneNo
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
    if (profiles && profiles.length > 0) {
      saveUser();
      setInterval(() => {
        setChange((prev) => prev + 1);
      }, 5000)
    }
  }, [profiles]);

  return (
    <div className='navbar shadow-md'>
      <div className='w-full grid grid-cols-2 sm:grid-cols-3 justify-between px-4 py-[10px] relative'>

        <div className="hidden sm:block"></div>

        <div className="flex justify-start sm:justify-center">
          <a href="/" className="inline-block">
            <img sizes="auto" alt="Logo" className="size-[60px] object-cover
                sm:size-[80px] sm:px-[10px] sm:py-[7.5px]" src="/sixer.gif" />
          </a>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center space-x-3">
            <div className="primary-gradient rounded-[10px] p-0.5 overflow-hidden">
              <ConnectButton
                client={client}
                connectButton={{
                  label: "Login / Signup",
                }}
                modalSize="wide"
                autoConnect={true}
                wallets={wallets}
                connectModal={{
                  showThirdwebBranding: false,
                }}
                onConnect={(profile) => {
                  setChange((prev) => prev + 1);
                  saveUser(); // works as expected
                }}
                onDisconnect={() => {
                  console.log("Wallet disconnected");
                  setChange((prev) => prev + 1);
                  window.location.reload();
                }}
                theme="light"
                detailsModal={{
                  assetTabs: ["token", "nft"],
                }}
                chain={sepolia}
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
