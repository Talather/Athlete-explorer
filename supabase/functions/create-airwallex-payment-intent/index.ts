import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from './cors.ts';

console.log(`Function "airwallex-payment" up and running!`);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const body = await req.json();
    const { quantity, wallet, contractAddress, pricePerNFT, email, userId, currency } = body;

    if (!quantity || quantity <= 0 || !wallet || !contractAddress || !pricePerNFT || !userId) {
      return new Response(JSON.stringify({
        error: "Missing required fields"
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }

    const amount = quantity * (pricePerNFT * 100);
    const clientId = "r-P9Pwh_TaGMSm7WOh5n2Q";
    const apiKey = "113b36f484fabd93c976b58b9d7d8417888c51335bc30484201a1da19271535c6a557855e4f1006979e8320bf3b5c64f";

    // First, get access token
    const authResponse = await fetch('https://api-demo.airwallex.com/api/v1/authentication/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-api-key': apiKey,
      },
      body: JSON.stringify({})
    });

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Airwallex');
    }

    const authData = await authResponse.json();
    const accessToken = authData.token;

    // Create payment intent
    const paymentIntentResponse = await fetch('https://api-demo.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        request_id: `${Date.now()}-${userId}`,
        amount: Math.round(amount) / 100, // Airwallex expects decimal amount
        currency: currency.toUpperCase(),
        merchant_order_id: `order_${Date.now()}_${userId}`,
        order: {
          products: [{
            code: contractAddress,
            name: `NFT Purchase - ${quantity} token(s)`,
            desc: `Fan token purchase for ${wallet}`,
            sku: contractAddress,
            type: "digital_goods",
            unit_price: pricePerNFT,
            quantity: quantity
          }]
        },
        descriptor: "FANSDAY NFT PURCHASE",
        metadata: {
          wallet,
          contract: contractAddress,
          pricePerNFT: pricePerNFT.toString(),
          quantity: quantity.toString(),
          userId: userId.toString()
        },
        return_url: `${req.headers.get('origin') || 'https://localhost:3000'}/payment-success`,
        cancel_url: `${req.headers.get('origin') || 'https://localhost:3000'}/payment-cancel`
      })
    });

    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.text();
      console.error('Airwallex payment intent creation failed:', errorData);
      throw new Error('Failed to create Airwallex payment intent');
    }

    const paymentIntentData = await paymentIntentResponse.json();

    return new Response(JSON.stringify({
      clientSecret: paymentIntentData.client_secret,
      paymentIntentId: paymentIntentData.id,
      accessToken: accessToken
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });

  } catch (err) {
    console.error("Airwallex error:", err);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: err.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
