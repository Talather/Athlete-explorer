import React, { useState, useEffect } from 'react';
import { useConnect , useActiveAccount , useActiveWallet , useAutoConnect, ConnectButton} from "thirdweb/react";
import { inAppWallet  } from "thirdweb/wallets";
import { client } from '../client';
import { X, Mail, Phone, MessageCircle, Clock } from 'lucide-react';
import {preAuthenticate} from 'thirdweb/wallets';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './CustomWalletModal.css';
import { 
  sendWhatsAppVerification, 
  generateVerificationCode, 
  storeVerificationData, 
  verifyCode, 
  clearVerificationData,
  getRemainingTime,
} from '../utils/whatsappVerification';
const CustomWalletModal = ({ isOpen, onClose, onConnect }) => {
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const account = useActiveAccount();
  const connectedWallet = useActiveWallet();
  const [isVerification, setIsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerification, setIsPhoneVerification] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const { connect } = useConnect();
    const { data: autoConnected, isLoading } = useAutoConnect({
      client,
    });
  const sendVerificationCode = async  ()=>{
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsConnecting(true);
    await preAuthenticate({
      client:client,
      strategy:'email',
      email
    });
    setIsConnecting(false);
    setIsVerification(true);
  }

  const handleEmailConnect = async() => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsConnecting(true);
    const account = await connect(async () =>
      {
      const wallet = inAppWallet();
       await wallet.connect({
         client,
         strategy: 'email',
         email,
         verificationCode,
       })
       return wallet;
      }
   );
      console.log(account);
      if (account) {
        setIsConnecting(false);
       onConnect(account);
       onClose();
     }
  };

  const handlePhoneConnect = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsSendingWhatsApp(true);
    setError('');
    
    try {
      // Generate verification code
      const code = generateVerificationCode();
      
      // Send WhatsApp verification
      const success = await sendWhatsAppVerification(phone, code);
      
      
      if (success) {
        // Store verification data
        storeVerificationData(phone, code);
        
        // Switch to verification mode
        setIsPhoneVerification(true);
        setRemainingTime(600); // 10 minutes
        
        // Start countdown timer
        const timer = setInterval(() => {
          const remaining = getRemainingTime();
          setRemainingTime(remaining);
          
          if (remaining <= 0) {
            clearInterval(timer);
            setIsPhoneVerification(false);
            setError('Verification code expired. Please try again.');
          }
        }, 1000);
        
      } else {
        setError('Failed to send verification code. Please check your phone number and try again.');
      }
    } catch (error) {
      console.error('WhatsApp verification error:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };
  
  const handlePhoneVerification = async () => {
    if (!phoneVerificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    try {
      // Verify the code
      const verificationResult = verifyCode(phoneVerificationCode);
      
      console.log(verificationResult);
      if (verificationResult.success) {
        // Connect with thirdweb using the verified phone number
        const account = await connect(async () => {
          const wallet = inAppWallet();
          await wallet.connect({
            client,
            strategy: 'auth_endpoint',
            payload: phone,
          });
          return wallet;
        });
        
        if (account) {
          onConnect(account);
          onClose();
          // Clear verification data
          clearVerificationData();
        }
      } else {
        setError(verificationResult.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const resendWhatsAppCode = async () => {
    await handlePhoneConnect();
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clear verification data when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearVerificationData();
      setIsPhoneVerification(false);
      setPhoneVerificationCode('');
      setRemainingTime(0);
    }
  }, [isOpen]);
  const handleGoogleConnect =async () => {
   const account = await connect(async () =>
   {
   const wallet = inAppWallet();
    await wallet.connect({
      client,
      strategy: 'google',
    })
    return wallet;
   }
);
   console.log(account);
   if (account) {
    onConnect(account);
    onClose();
  }
  };
  const handleDiscordConnect =async () => {
    const account = await connect(async () =>
    {
    const wallet = inAppWallet();
     await wallet.connect({
       client,
       strategy: 'discord',
     })
     return wallet;
    }
 );
    console.log(account);
    if (account) {
     onConnect(account);
     onClose();
   }
   };
   const handleFacebookConnect =async () => {
    const account = await connect(async () =>
    {
    const wallet = inAppWallet();
     await wallet.connect({
       client,
       strategy: 'facebook',
     })
     return wallet;
    }
 );
    console.log(account);
    if (account) {
     onConnect(account);
     onClose();
   }
   };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Login / Signup</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isConnecting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!selectedAuth ? (
            /* Auth Method Selection */
            <div className="space-y-3">
              <p className="text-gray-600 text-center mb-6">
                Choose your preferred login method
              </p>

              {/* Email Option */}
              <button
                onClick={() => setSelectedAuth('email')}
                className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#9352ee] hover:bg-purple-50 transition-all duration-200"
                disabled={isConnecting}
              >
                <Mail className="w-5 h-5 text-[#9352ee]" />
                <span className="font-medium text-gray-700">Continue with Email</span>
              </button>

              {/* Phone Option */}
              <button
                onClick={() => setSelectedAuth('phone')}
                className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#9352ee] hover:bg-purple-50 transition-all duration-200"
                disabled={isConnecting}
              >
                <Phone className="w-5 h-5 text-[#9352ee]" />
                <span className="font-medium text-gray-700">Continue with Whatsapp</span>
              </button>

              {/* Google Option */}
              <button
                onClick={async() => await handleGoogleConnect()}
                className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200"
                disabled={isConnecting}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>

              {/* Discord Option */}
              <button
                onClick={async() => await handleDiscordConnect()}
                className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#5865F2] hover:bg-indigo-50 transition-all duration-200"
                disabled={isConnecting}
              >
                <MessageCircle className="w-5 h-5 text-[#5865F2]" />
                <span className="font-medium text-gray-700">Continue with Discord</span>
              </button>

              {/* Facebook Option */}
              <button
                onClick={async() => await handleFacebookConnect()}
                className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#1877F2] hover:bg-blue-50 transition-all duration-200"
                disabled={isConnecting}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium text-gray-700">Continue with Facebook</span>
              </button>
            </div>
          ) : selectedAuth === 'email' ? (
            /* Email Input */
            <>
            {isVerification ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedAuth(null)}
                  className="text-[#9352ee] hover:text-[#7c3aed] text-sm font-medium"
                >
                  ← Back to email
                </button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                    disabled={isConnecting}
                  />
                </div>
                
                <button
                  onClick={handleEmailConnect}
                  disabled={isConnecting || !verificationCode}
                  className="w-full bg-gradient-to-r from-[#9352ee] to-[#e99289] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedAuth(null)}
                  className="text-[#9352ee] hover:text-[#7c3aed] text-sm font-medium"
                >
                  ← Back to options
                </button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all"
                    disabled={isConnecting}
                  />
                </div>
                
                <button
                  onClick={sendVerificationCode}
                  disabled={isConnecting || !email}
                  className="w-full bg-gradient-to-r from-[#9352ee] to-[#e99289] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Connecting...' : 'Continue with Email'}
                </button>
              </div>
            )}
            </>
          ) : selectedAuth === 'phone' ? (
            /* Phone Input and Verification */
            <>
            {isPhoneVerification ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsPhoneVerification(false);
                    clearVerificationData();
                  }}
                  className="text-[#9352ee] hover:text-[#7c3aed] text-sm font-medium"
                >
                  ← Back to phone number
                </button>
                
                <div className="text-center mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-700">
                      📱 Verification code sent to WhatsApp
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {phone}
                    </p>
                  </div>
                  
                  {remainingTime > 0 && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Code expires in {formatTime(remainingTime)}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Verification Code
                  </label>
                  <input
                    type="text"
                    value={phoneVerificationCode}
                    onChange={(e) => setPhoneVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9352ee] focus:border-transparent outline-none transition-all text-center text-lg font-mono"
                    disabled={isConnecting}
                    maxLength={6}
                  />
                </div>
                
                <button
                  onClick={handlePhoneVerification}
                  disabled={isConnecting || phoneVerificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-[#9352ee] to-[#e99289] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? 'Verifying...' : 'Verify & Connect'}
                </button>
                
                <button
                  onClick={resendWhatsAppCode}
                  disabled={isSendingWhatsApp || remainingTime > 540} // Allow resend after 1 minute
                  className="w-full text-[#9352ee] hover:text-[#7c3aed] text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingWhatsApp ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedAuth(null)}
                  className="text-[#9352ee] hover:text-[#7c3aed] text-sm font-medium"
                >
                  ← Back to options
                </button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="phone-input-container">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="US"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter phone number"
                      className="w-full"
                      disabled={isSendingWhatsApp}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send a verification code to your WhatsApp
                  </p>
                </div>
                
                <button
                  onClick={handlePhoneConnect}
                  disabled={isSendingWhatsApp || !phone}
                  className="w-full bg-gradient-to-r from-[#9352ee] to-[#e99289] text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingWhatsApp ? 'Sending Code...' : 'Send WhatsApp Code'}
                </button>
              </div>
            )}
            </>
          ) : null}

          {isConnecting && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9352ee]"></div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomWalletModal;
