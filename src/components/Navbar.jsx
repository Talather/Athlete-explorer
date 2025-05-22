import { Link } from "react-router-dom"
import { ConnectButton } from "thirdweb/react";
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { sepolia } from "thirdweb/chains";
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
  
  // Get athletes from Redux store
  const { athletes } = useSelector(state => state.athletes);

  const contracts = new Set(athletes?.map(athlete => athlete.nftContractAddress !== null ? athlete.nftContractAddress : "0x683Fb845548d161A9cAddedEDf46FcbB713FEB22"));
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
        <div className="flex-1 hidden md:block">
        
        </div>
        
        <div className="flex justify-start md:justify-center flex-1">
          <a href="/" className="py-[10px] lg:p-[10px]">
            <img sizes="auto" alt="Logo" className="w-[60px] h-[60px] md:px-[10px] md:py-[7.5px] 
              sm:size-[80px] sm:px-0 sm:py-0" src="/sixer.gif"/>
          </a>
        </div>
        
        <div className="flex justify-end flex-1">
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
  )
}

export default Navbar
