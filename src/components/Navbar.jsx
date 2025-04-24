import { Link } from "react-router-dom"
import { ConnectButton } from "thirdweb/react";
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { polygon } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";



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
  const [change,setChange] = useState(0);

useEffect(() => {
  const buttons = document.querySelectorAll('.css-86pfay');
  const buttons2 = document.querySelectorAll('.css-1j66weo');
  buttons2.forEach((btn) => {
    if (btn.innerText === 'Buy') {
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

  

  const saveUser = async () => {
    try {
      if (!profiles || profiles.length === 0) return;
      
      const userId = profiles[0]?.details.id;
      const userEmail = profiles[0]?.details.email;
      
    
      if (!userId || !userEmail) return;

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
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { id: userId, email: userEmail }
          ]);

        if (insertError) {
          console.error('Error saving user:', insertError);
        } else {
          console.log('User saved successfully');
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
      <div className='w-full flex items-center justify-between px-4'>
        <div className="flex-1">
        
        </div>
        
        <div className="flex justify-center flex-1">
          <a href="/" className="sm:p-[10px]">
            <img sizes="auto" alt="Logo" className="w-[75px] h-[70px] px-[10px] py-[7.5px] 
              sm:w-[80px] sm:h-[80px] sm:px-0 sm:py-0" src="/sixer.gif"/>
          </a>
        </div>
        
        <div className="flex justify-end flex-1">
          <ConnectButton 
            client={client}
            
            connectButton={{
              label: "Login / Signup",
            }}
            // buttonTitle="Link Your Wallet"
            theme="light"
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
            detailsModal={{
              assetTabs: ["token"],
            }}
            chain={polygon}
            supportedTokens={
              {
                [polygon.id]: [
                  {
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                    name: "$FIGO",
                    symbol: "FIGO",
                    icon: "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/athletes/0.8942476293941108.png",
                  },
                  {
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                    name: "$POATAN",
                    symbol: "POATAN",
                    icon: "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/athletes/0.12551816537350713.jpg",
                  },
                  {
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                    name: "$HARDEN",
                    symbol: "HARDEN",
                    icon: "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/athletes/0.5813046075726962.png",
                  },
                  {
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                    name: "$CURRY",
                    symbol: "CURRY",
                    icon: "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/athletes/0.7686259196047924.png",
                  },
                  {
                    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
                    name: "$LEBRON",
                    symbol: "LEBRON",
                    icon: "https://veoivkpeywpcyxaikgng.supabase.co/storage/v1/object/public/athletes/0.021162288126469475.jpg",
                  },
                ],
              }
            }
            
            
            
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar
