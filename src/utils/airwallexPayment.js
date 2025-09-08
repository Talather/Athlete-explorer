// Airwallex payment utility functions
import { supabase } from '../lib/supabase';

// Complete Airwallex payment processing (server-side)
export const processCompleteAirwallexPayment = async (paymentData, cardDetails) => {
  try {
    const { data, error } = await supabase.functions.invoke('airwallex-payment', {
      body: {
        ...paymentData,
        cardDetails
      },
    });

    if (error) {
      console.error('Error processing Airwallex payment:', error);
      throw new Error('Failed to process payment');
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Payment failed');
    }

    return data;
  } catch (error) {
    console.error('Airwallex payment processing error:', error);
    throw error;
  }
};
