import { Link } from "react-router-dom"
import { ConnectButton } from "thirdweb/react";
import { client } from '../client';
import { useProfiles } from "thirdweb/react";
import { supabase } from '../lib/supabase';
import {  useEffect } from 'react';

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
            theme="light"
            modalSize="wide"
            autoConnect={true}
            wallets={wallets}
            onConnect={(profile)=>{
              saveUser();
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar
