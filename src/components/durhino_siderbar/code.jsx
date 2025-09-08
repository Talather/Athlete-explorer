import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import { client } from './../../client';
import { useProfiles, useActiveWallet } from "thirdweb/react";
import { ConnectEmbed } from 'thirdweb/react';
import { inAppWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { supabase } from './../../lib/supabase';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { convertCurrency, formatCurrency } from '../../utils/currencyConverter';
import { processCompleteAirwallexPayment } from '../../utils/airwallexPayment';
import { useNavigate } from 'react-router-dom';

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "phone", "discord", "facebook"],
    },
  }),
];

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RQyMEPNwkgmNBRfcneVX7k3o4kE3d95JtSsJVNoQmQYCizB7gRD476gwj0wawtj6vJtirQ2ZFcyMDUbVAZYSM5H00ovm9pg1f');
// Wrapper component that provides Stripe context
const RightSidebar = ({ isOpen, currentFto, onClose }) => {
  return (
    <>
      <Elements stripe={stripePromise}>
        <RightSidebarContent isOpen={isOpen} currentFto={currentFto} onClose={onClose} />
      </Elements>
    </>
  );
};

// Main component with Stripe functionality
const RightSidebarContent = ({ isOpen, currentFto, onClose }) => {
  const navigate = useNavigate();
  const wallet = useActiveWallet();
    const address = wallet?.getAccount().address;
  //  if (!profiles || profiles.length === 0) return;
  const { data: profiles } = useProfiles({
    client,
  });
  const stripe = useStripe();
  const elements = useElements();
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState('stripe'); // 'stripe' or 'airwallex'
  const [airwallexCardDetails, setAirwallexCardDetails] = useState({
    number: '',
    expiry_month: '',
    expiry_year: '',
    cvc: '',
    name: ''
  });
  
  const [quantity, setQuantity] = useState(1);
  const pricePerNFT = currentFto?.Atheletes?.fanTokenInitialPrice || 0;
  const total = quantity * pricePerNFT;

  // Redux settings state for currency
  const { currency, exchangeRates } = useSelector(state => state.settings);
  console.log(currency);

  // Helper function to convert and format price
  const getFormattedPrice = (priceInUSD) => {
 
    if (!priceInUSD) return '€0.00';
    
    const priceInEUR = priceInUSD ; // Convert USD to EUR
    
    const convertedPrice = convertCurrency(priceInEUR, 'EUR', currency, exchangeRates);
    const formattedPrice = formatCurrency(convertedPrice, currency);
    
    return formattedPrice;
  };

  const handleIncrease = e => {
    e.preventDefault()
    setQuantity(prev => prev + 1)
  }

  const handleDecrease = e => {
    e.preventDefault()
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!termsAccepted){
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    if ((!stripe || !elements) && paymentProvider === 'stripe') {
      return;
    }
    
    if (quantity <= 0) {
      return;
    }
    
    setLoading(true);
    setPaymentError(null);
    setShowRetry(false);
    
    if(!currentFto.Atheletes.nftContractAddress){
      setPaymentError("Contract address is not found");
      setLoading(false);
      return;
    }

    const paymentData = {
      quantity: quantity,
      wallet: address,
      pricePerNFT: convertCurrency(pricePerNFT, 'EUR', currency, exchangeRates),
      contractAddress: currentFto?.Atheletes?.nftContractAddress,
      email: profiles?.[0]?.details?.email || "test@example.com",
      userId: profiles?.[0]?.details.id,
      currency: currency,
    };
    
    try {
      if (paymentProvider === 'stripe') {
        await processStripePayment(paymentData);
      } else {
        await processAirwallexPaymentFlow(paymentData);
      }
    } catch (error) {
      console.log( error);
      if (paymentProvider === 'stripe') {
        // if (error.toString().includes("incomplete_number")) {
        //   toast.error("Please enter a valid card number");
        // }else{
          // Stripe failed, offer retry with Airwallex
          setPaymentError(`Payment failed, but you can retry. On retry, we'll process your payment through an alternative provider`);
          setShowRetry(true);
          toast.error(`Payment failed, but you can retry. On retry, we'll process your payment through an alternative provider`);
        // }
      } else {
        // Both providers failed
        setPaymentError(error.message || 'Payment failed with both providers');
        toast.error(`Payment failed, but you can retry. On retry, we'll process your payment through an alternative provider`);
      }
    } finally {
      setLoading(false);
    }
  };

  const processStripePayment = async (paymentData) => {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: paymentData,
    });
    
    if (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw new Error(error.message || 'Failed to create Stripe payment');
    }
    
    if (!data || !data.clientSecret) {
      throw new Error('No client secret received from Stripe server');
    }
    
    console.log('Stripe payment intent created');
    const {clientSecret} = data;
    
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: profiles?.[0]?.details?.email || '',
          name: profiles?.[0]?.details?.displayName || '',
        },
      },
    });
    
    if (confirmError) {
      console.error('Stripe payment confirmation error:', confirmError);
      throw new Error(confirmError.code);
    }
    
    if (paymentIntent.status === 'succeeded') {
      console.log('Stripe payment succeeded:', paymentIntent.id);
      handlePaymentSuccess();
    } else {
      throw new Error(`Payment status: ${paymentIntent.status}. Expected 'succeeded'.`);
    }
  };

  const processAirwallexPaymentFlow = async (paymentData) => {
    // Validate Airwallex card details
    if (!airwallexCardDetails.number || !airwallexCardDetails.expiry_month || 
        !airwallexCardDetails.expiry_year || !airwallexCardDetails.cvc) {
      throw new Error('Please fill in all card details');
    }

    const cardDetails = {
      number: airwallexCardDetails.number.replace(/\s/g, ''), // Remove spaces
      expiry_month: airwallexCardDetails.expiry_month,
      expiry_year: airwallexCardDetails.expiry_year,
      cvc: airwallexCardDetails.cvc,
      name: airwallexCardDetails.name || profiles?.[0]?.details?.displayName || 'Customer'
    };

    console.log('Processing Airwallex payment with card details:', {
      ...cardDetails,
      number: '****-****-****-' + cardDetails.number.slice(-4),
      cvc: '***'
    });
    
    // Process complete payment through Edge function
    const paymentResult = await processCompleteAirwallexPayment(paymentData, cardDetails);
    
    if (paymentResult.success) {
      console.log('Airwallex payment succeeded:', paymentResult.paymentId);
      handlePaymentSuccess();
    } else {
      throw new Error(paymentResult.error || 'Airwallex payment failed');
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Close the sidebar after a brief delay to show success message
    setTimeout(() => {
      onClose();
      // Show toast notification after sidebar is closed
      toast.success(
        'Payment successful, you can now select your athlete and an event.',
        {
          icon: '🎉',
          duration: 5000,
        }
      );
      // Redirect to home page
      navigate('/');
    }, 1500);
  };

  const handleRetryPayment = () => {
    setPaymentProvider('airwallex');
    setPaymentError(null);
    setShowRetry(false);
    // The form will now use Airwallex on next submit
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable body scroll
    } else {
      document.body.style.overflow = 'auto'; // Restore body scroll
    }

    return () => {
      document.body.style.overflow = 'auto'; // Ensure cleanup on unmount
    };
  }, [isOpen]);

  return (
    <div className={`fixed top-0 right-0 h-[100vh] overflow-y-auto sidebar-shadow
            bg-[#F0F0F0] transition-all duration-300 z-50 w-full max-w-[767px]
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <img
        src='/closeButton.svg'
        alt='close'
        className='size-8 p-[5px] bg-white rounded-full absolute left-2 top-2'
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />

      <div className='flex flex-col sm:flex-row  h-full'>
        <div className='sm:max-w-[316px] w-full p-5 space-y-10'>
          
          <h1 className='px-[10px] py-[8px] text-[30px] text-center font-bold leading-none'>${currentFto.Atheletes.fanTokenSymbol}</h1>

          <div className='custom-shadow bg-white rounded-[20px] py-5 divide-y-2 w-full !mt-0'>

            <div className='pb-[20px] px-[10px] flex justify-between'>
              <button className='btn-plus text-[26px] rounded-tl-[9px] rounded-bl-[9px] px-[15px] text-white font-bold' onClick={handleDecrease}>−</button>

              <input type="number" min={0} value={quantity}
                className='text-center border border-[#ccc] w-full text-[#333] text-sm py-2 px-3 outline-none focus:border-blue-400 font-[600]'
              />

              <button className='btn-minus text-[26px] rounded-tr-[9px] rounded-br-[9px] px-[15px] text-white font-bold' onClick={handleIncrease}>+</button>
            </div>


            <div className='text-xl font-bold divide-y-2'>
              <div className='flex items-center justify-between px-[10px] py-[13px]'>
                <span>NFT price</span>
                <span>{getFormattedPrice(pricePerNFT)}</span>
              </div>
              <div className='flex items-center justify-between px-[10px] py-[13px]'>
                <span>Total</span>
                <span>{getFormattedPrice(total)}</span>
              </div>
            </div>
          </div>

        </div>

        {profiles?.length > 0 ? (
          <div className='bg-white custom-shadow py-[20px] px-[20px] sm:px-[30px] w-full h-full'>
            <form className='text-[#1D1D1F] h-full flex flex-col gap-5 overflow-auto'>

              <div className='flex flex-col w-full gap-1'>
                <label htmlFor="field-2" className="text-base font-bold">Email address</label>
                <input className="py-2 px-3 rounded outline-none custom-shadow
                    border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                  maxLength="256" name="field-2"
                  data-name="Field 2" placeholder="Email address"
                  type="email" id="field-2" required=""
                  value={profiles[0]?.details.email}
                />
              </div>

              {profiles.length === 0 && (
                <div id="myList" className='flex flex-col gap-[10px]'>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-2" className="text-base font-bold">NFT delivery</label>
                    <div className="border-[1px] border-[#ccc] rounded-[10px] px-[20px] py-[16px]">

                      <div className="flex items-center gap-[10px]">
                        <img src="/winterLogo.png" loading="lazy" alt="cold" className='w-[25px] shrink-0' />
                        <h6 className="text-base font-bold">Winter wallet</h6>
                      </div>

                      <div className="text-sm leading-snug text-[#00000099]">
                        No Ethereum wallet? No worries, Winter will store and manage your NFT htmlFor you.
                      </div>

                    </div>
                  </div>

                  <div className={`border-[1px] flex flex-col cursor-pointer transition-all duration-300 gap-2 border-[#ccc] rounded-[10px] px-[20px] py-[16px]
                      ${open ? 'bg-[#f1f1f1]' : ''}
                    `}>

                    <div onClick={() => setOpen(!open)} className='flex flex-col gap-1'>
                      <div className="flex items-start gap-[10px]">
                        <img src='/ethLogo.png' alt='ETH' loading="lazy" className="w-[25px] shrink-0" />
                        <h6 className="text-base font-bold">
                          Ethereum-supported Wallet Address
                        </h6>
                      </div>
                      <div className="text-sm leading-snug text-[#00000099] w-full text-left">
                        Buy this NFT to a Ethereum wallet.<br />
                      </div>
                    </div>

                    <div ref={contentRef}
                      className="flex items-center flex-col collapse-item gap-2 overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
                      }}
                    >
                      <input className="py-2 px-3 rounded outline-none custom-shadow
                        border-[1px] border-[#ccc] w-full focus:border-blue-400 font-[600]"
                        maxLength="256" name="field-3"
                        data-name="Field 2" placeholder="e.g. 0xe0CB5... or joe.crypto, joe.eth, ..."
                        type="text" id="field-3" required=""
                      />
                      <div className="text-sm text-[#00000099] text-center">or</div>

                      <input type="submit" data-wait="Please wait..."
                        className="text-center bg-[#0e76fd] font-bold rounded-[5px] px-[15px] py-[9px] text-white"
                        value="Connect your ETH wallet"
                      />
                      <div className="text-[#00000099] text-center text-sm font-bold leading-tight">
                        🚨 WARNING! Do NOT enter in a Coinbase address. Only enter in a wallet you have the private keys to. We can't help in case of a mistake.
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div className='flex flex-col w-full gap-1'>
                <label htmlFor="card-element" className="text-base font-bold">Card details</label>
                
                {paymentProvider === 'stripe' ? (
                  <div className="py-3 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                            fontFamily: 'Arial, sans-serif',
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card number (e.g., 2223000048410010)"
                      className="w-full py-2 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                      value={airwallexCardDetails.number}
                      onChange={(e) => setAirwallexCardDetails(prev => ({...prev, number: e.target.value}))}
                      maxLength="19"
                    />
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="MM"
                        className="w-1/4 py-2 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                        value={airwallexCardDetails.expiry_month}
                        onChange={(e) => setAirwallexCardDetails(prev => ({...prev, expiry_month: e.target.value}))}
                        maxLength="2"
                      />
                      <input
                        type="text"
                        placeholder="YYYY"
                        className="w-1/4 py-2 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                        value={airwallexCardDetails.expiry_year}
                        onChange={(e) => setAirwallexCardDetails(prev => ({...prev, expiry_year: e.target.value}))}
                        maxLength="4"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-1/4 py-2 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                        value={airwallexCardDetails.cvc}
                        onChange={(e) => setAirwallexCardDetails(prev => ({...prev, cvc: e.target.value}))}
                        maxLength="4"
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Cardholder name"
                      className="w-full py-2 px-3 rounded outline-none custom-shadow border-[1px] border-[#ccc] focus:border-blue-400 font-[600]"
                      value={airwallexCardDetails.name}
                      onChange={(e) => setAirwallexCardDetails(prev => ({...prev, name: e.target.value}))}
                    />
                    
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      💡 For testing, use: 2223000048410010, 12/2025, CVC: 123
                    </div>
                  </div>
                )}
              </div>
              
              {paymentError && (
                <div className="text-red-500 text-sm font-medium">
                  {paymentError}
                </div>
              )}

              {showRetry && (
                <button 
                  type="button"
                  className="inline-block text-center w-full rounded-[10px] text-base font-bold bg-orange-500 hover:bg-orange-600 text-white p-[10px] mb-2"
                  onClick={handleRetryPayment}
                >
                  Retry with Alternative Payment Method
                </button>
              )}
              
              {paymentSuccess && (
                <div className="text-green-500 text-sm font-medium">
                  Payment successful!
                </div>
              )}

              <label className='flex items-start gap-1 text-sm font-bold'>
                <input 
                  type='checkbox' 
                  className="mt-1"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />I accept Fansday's Terms and Conditions.
              </label>

              <button 
                className={`inline-block text-center w-full rounded-[10px] text-base font-bold ${loading || !termsAccepted ? 'bg-gray-500' : 'bg-black'} text-white p-[10px]`}
                disabled={!stripe || loading || quantity <= 0 || total <= 0}
                onClick={handleSubmit}
              >
                {loading ? 'Processing...' : `Pay ${getFormattedPrice(total)}`}
              </button>

            </form>
          </div>
        ) : (
          <div className='bg-white custom-shadow py-10 px-12 h-[100%] flex  justify-center'>

            <div className='bg-white  h-[50%] '>
              <ConnectEmbed client={client}
                theme="light"
                wallets={wallets}
                showThirdwebBranding={false}
                chain={sepolia}

              />
            </div>
          </div>


        )}
      </div>
    </div>
  )
}

export default RightSidebar
