import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { ethers } from "npm:ethers@5.7.2";
import { corsHeaders } from "./cors.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Ethers setup
const PRIVATE_KEY = Deno.env.get("PRIVATE_KEY");
const RPC_URL = Deno.env.get("RPC_URL");
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Supabase setup
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

// Airwallex webhook signing secret
const AIRWALLEX_WEBHOOK_SECRET = Deno.env.get("AIRWALLEX_WEBHOOK_SECRET");

console.log(`Function "airwallex-webhook" up and running!`);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  try {
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);
    
    // Verify webhook signature (optional but recommended for production)
    const signature = request.headers.get("x-signature");
    if (AIRWALLEX_WEBHOOK_SECRET && signature) {
      // Implement signature verification here if needed
      // This would require crypto operations similar to Stripe
    }

    console.log(`✅ Airwallex webhook received: ${body.name}`);
    console.log("Webhook data:", JSON.stringify(body, null, 2));

    // Handle successful payment
    if (body.name === "payment_intent.succeeded") {
      const paymentIntent = body.data.object;
      const metadata = paymentIntent.metadata || {};
      
      const { 
        wallet, 
        contract: contractAddress, 
        quantity, 
        pricePerNFT, 
        userId 
      } = metadata;

      console.log("wallet:", wallet);
      console.log("contractAddress:", contractAddress);
      console.log("quantity:", quantity);

      if (!wallet || !contractAddress || !quantity) {
        console.error("❌ Missing metadata for minting:", metadata);
        return new Response("Missing metadata for minting", {
          status: 400,
          headers: corsHeaders
        });
      }

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
          price_per_nft: parseFloat(pricePerNFT) * 100, // Convert to cents
          total_amount: Math.round(paymentIntent.amount * 100), // Convert to cents
          airwallex_payment_id: paymentIntent.id,
          currency: paymentIntent.currency,
          email: paymentIntent.customer?.email || metadata.email,
          status: paymentIntent.status,
          created_at: new Date().toISOString()
        });

        if (error) {
          console.error("❌ Failed to log transaction:", error);
        } else {
          console.log("📦 Transaction recorded in database");
        }

        return new Response(JSON.stringify({
          success: true,
          message: "NFTs minted successfully"
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        });

      } catch (err) {
        console.error("❌ Minting failed:", err);
        return new Response(JSON.stringify({
          success: false,
          error: "Minting error",
          details: err.message
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 500
        });
      }
    }

    // Handle other webhook events
    console.log(`ℹ️ Unhandled Airwallex event: ${body.name}`);
    return new Response(JSON.stringify({
      success: true,
      message: "Webhook received"
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });

  } catch (err) {
    console.error("❌ Airwallex webhook error:", err);
    return new Response(JSON.stringify({
      success: false,
      error: "Webhook processing error",
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
