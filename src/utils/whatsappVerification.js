// WhatsApp verification utility using Supabase Edge Function
import { supabase } from '../lib/supabase.js';



/**
 * Generate a random 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send WhatsApp verification message via Supabase Edge Function
 * @param {string} phoneNumber - Phone number in international format (e.g., +1234567890)
 * @param {string} verificationCode - 6-digit verification code
 * @returns {Promise<boolean>} - Success status
 */
export const sendWhatsAppVerification = async (phoneNumber, verificationCode) => {
  try {
    console.log('📱 Sending WhatsApp verification via Edge Function...');
    console.log('📞 Phone number:', phoneNumber);
    console.log('🔐 Verification code:', verificationCode);
    
    const { data, error } = await supabase.functions.invoke('whatsapp-verification', {
      body: {
        action: 'send',
        phoneNumber,
        verificationCode
      }
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      return false;
    }

    if (data?.success) {
      console.log('✅ WhatsApp verification sent successfully');
      console.log('📋 Message ID:', data.messageId);
      return true;
    } else {
      console.error('❌ Failed to send WhatsApp verification:', data?.error);
      return false;
    }
  } catch (error) {
    console.error('💥 Error sending WhatsApp verification:', error);
    return false;
  }
};

/**
 * Store verification data in localStorage
 * @param {string} phoneNumber - Phone number
 * @param {string} verificationCode - Generated code
 */
export const storeVerificationData = (phoneNumber, verificationCode) => {
  const verificationData = {
    phoneNumber,
    code: verificationCode,
    timestamp: Date.now(),
    expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes expiry
  };
  
  localStorage.setItem('whatsapp_verification', JSON.stringify(verificationData));
  console.log('Verification data stored:', verificationData);
};

/**
 * Verify the entered code against stored verification data
 * @param {string} enteredCode - Code entered by user
 * @returns {object} - Verification result with success status and phone number
 */
export const verifyCode = (enteredCode) => {
  try {
    const storedData = localStorage.getItem('whatsapp_verification');
    if (!storedData) {
      return { success: false, error: 'No verification data found' };
    }

    const verificationData = JSON.parse(storedData);
    const now = Date.now();

    // Check if code has expired
    if (now > verificationData.expiresAt) {
      localStorage.removeItem('whatsapp_verification');
      return { success: false, error: 'Verification code has expired' };
    }

    // Check if code matches
    if (enteredCode === verificationData.code) {
      localStorage.removeItem('whatsapp_verification');
      return { 
        success: true, 
        phoneNumber: verificationData.phoneNumber 
      };
    } else {
      return { success: false, error: 'Invalid verification code' };
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, error: 'Verification failed' };
  }
};

/**
 * Clear verification data from localStorage
 */
export const clearVerificationData = () => {
  localStorage.removeItem('whatsapp_verification');
};

/**
 * Get remaining time for verification code
 * @returns {number} - Remaining time in seconds, or 0 if expired
 */
export const getRemainingTime = () => {
  try {
    const storedData = localStorage.getItem('whatsapp_verification');
    if (!storedData) return 0;

    const verificationData = JSON.parse(storedData);
    const now = Date.now();
    const remaining = Math.max(0, verificationData.expiresAt - now);
    
    return Math.floor(remaining / 1000); // Return seconds
  } catch (error) {
    return 0;
  }
};
