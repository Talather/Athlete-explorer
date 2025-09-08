import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from './cors.ts';
import { createClient } from "jsr:@supabase/supabase-js@2";

// Ethers setup
const PRIVATE_KEY = Deno.env.get("PRIVATE_KEY");
const RPC_URL = Deno.env.get("RPC_URL");
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
import { ethers } from "npm:ethers@5.7.2";


// Supabase setup
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

console.log(`Function "airwallex-complete-payment" up and running!`);
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json();
    const { quantity, wallet, contractAddress, pricePerNFT, email, userId, currency, cardDetails } = body;
    console.log(cardDetails);
    if (!quantity || quantity <= 0 || !wallet || !contractAddress || !pricePerNFT || !userId || !cardDetails) {
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
    const clientId = "3sirkvc1T1OWmb0HzowDvw";
    const apiKey = "2f8ed634efac5b76d59cd45bd3b50cdd18fea71f58bf27979f699b5fb8771ec893bf5f24deb5e1f7627b81cdaccfe38f";
    // Step 1: Get access token
    const authResponse = await fetch('https://api-demo.airwallex.com/api/v1/authentication/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-api-key': apiKey
      },
      body: JSON.stringify({})
    });
    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Airwallex');
    }
    const authData = await authResponse.json();
    const accessToken = authData.token;
    // Step 2: Create payment intent
    const paymentIntentResponse = await fetch('https://api-demo.airwallex.com/api/v1/pa/payment_intents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        request_id: `${email}_${Math.random()}`,
        amount: Math.round(amount) / 100,
        currency: currency.toUpperCase(),
        merchant_order_id: `${email}_${Math.random()}`,
        order: {
          products: [
            {
              code: contractAddress,
              name: `NFT Purchase - ${quantity} token(s)`,
              desc: `Fan token purchase for ${wallet}`,
              sku: contractAddress,
              type: "digital_goods",
              unit_price: pricePerNFT,
              quantity: quantity
            }
          ]
        },
        descriptor: "FANSDAY NFT PURCHASE",
        metadata: {
          wallet,
          contract: contractAddress,
          pricePerNFT: pricePerNFT.toString(),
          quantity: quantity.toString(),
          userId: userId.toString()
        }
      })
    });
    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.text();
      console.error('Airwallex payment intent creation failed:', errorData);
      throw new Error('Failed to create Airwallex payment intent');
    }
    const paymentIntentData = await paymentIntentResponse.json();
    // Step 3: Confirm payment intent
    const confirmResponse = await fetch(`https://api-demo.airwallex.com/api/v1/pa/payment_intents/${paymentIntentData.id}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        request_id: `confirm_-${email}_${Math.random()}`,
        payment_method: {
          type: "card",
          card: {
            number: cardDetails.number,
            expiry_month: cardDetails.expiry_month,
            expiry_year: cardDetails.expiry_year,
            cvc: cardDetails.cvc,
            name: cardDetails.name || email,
            billing: {
              email: email,
              first_name: cardDetails.name?.split(' ')[0] || 'Customer',
              last_name: cardDetails.name?.split(' ').slice(1).join(' ') || 'Name'
            }
          }
        },
        payment_method_options: {
          card: {
            auto_capture: true
          }
        }
      })
    });
    if (!confirmResponse.ok) {
      const errorData = await confirmResponse.text();
      console.error('Airwallex payment confirmation failed:', errorData);
      throw new Error('Failed to confirm payment');
    }
    const confirmData = await confirmResponse.json();
    // Check payment status
    if (confirmData.status === 'SUCCEEDED') {
      console.log('✅ Airwallex payment succeeded, proceeding with NFT minting...');
      
      try {
        // NFT contract ABI
        const abi = [
          "function mintTo(address recipient) external",
          "function mintMultipleTo(address recipient, uint256 quantity) external"
        ];

        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Mint NFTs based on quantity
        if (parseInt(quantity) === 1) {
          const tx = await contract.mintTo(wallet);
          await tx.wait();
          console.log(`✅ Minted 1 NFT to ${wallet}`);
        } else {
          const tx = await contract.mintMultipleTo(wallet, parseInt(quantity));
          await tx.wait();
          console.log(`✅ Minted ${quantity} NFTs to ${wallet}`);
        }

        // Log transaction to database
        const { error } = await supabase.from("transactions").insert({
          userId,
          wallet,
          contract_address: contractAddress,
          quantity: parseInt(quantity),
          price_per_nft: Math.round(pricePerNFT * 100), // Convert to cents
          total_amount: Math.round(confirmData.amount * 100), // Convert to cents
          airwallex_payment_id: confirmData.id,
          currency: confirmData.currency,
          email: email,
          status: confirmData.status,
          created_at: new Date().toISOString()
        });

        if (error) {
          console.error("❌ Failed to log transaction:", error);
        } else {
          console.log("📦 Transaction recorded in database");
        }

        return new Response(JSON.stringify({
          success: true,
          paymentId: confirmData.id,
          status: confirmData.status,
          amount: confirmData.amount,
          currency: confirmData.currency,
          nftsMinted: true,
          transactionLogged: !error
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        });

      } catch (mintError) {
        console.error("❌ NFT minting failed:", mintError);
        
        // Still return success for payment, but indicate minting failure
        return new Response(JSON.stringify({
          success: true,
          paymentId: confirmData.id,
          status: confirmData.status,
          amount: confirmData.amount,
          currency: confirmData.currency,
          nftsMinted: false,
          mintingError: mintError.message
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        });
      }
    } else {
      return new Response(JSON.stringify({
        success: false,
        status: confirmData.status,
        error: `Payment status: ${confirmData.status}`
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }
  } catch (err) {
    console.error("Airwallex complete payment error:", err);
    return new Response(JSON.stringify({
      success: false,
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
