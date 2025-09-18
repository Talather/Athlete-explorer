import "jsr:@supabase/functions-js/edge-runtime.d.ts";


import { corsHeaders } from './cors.ts'
console.log(`Function "whatsapp-verification" up and running!`);

const WHATSAPP_API_BASE_URL = 'https://waba-v2.360dialog.io'
const API_KEY = 'rKiwxIaNTJjc3Zh80NeYHDTIAK'

interface WhatsAppRequest {
  phoneNumber: string
  verificationCode: string
  action: 'send' | 'check_templates' | 'health_check'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, verificationCode, action }: WhatsAppRequest = await req.json()

    console.log(`📱 WhatsApp API request - Action: ${action}`)

    switch (action) {
      case 'send':
        if (!phoneNumber || !verificationCode) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Phone number and verification code are required' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        return await sendWhatsAppVerification(phoneNumber, verificationCode)
      
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action. Use: send, check_templates, or health_check' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('💥 WhatsApp API Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})



async function sendWhatsAppVerification(phoneNumber: string, verificationCode: string) {
  try {
    console.log('📱 Sending WhatsApp verification...')
    
    // Remove + from phone number for WhatsApp API
    const cleanPhoneNumber = phoneNumber.replace('+', '')
    
    const messageBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhoneNumber,
      type: "text",
      text: {
        body: `🔐 Your Fansday verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.`
      }
    }

    console.log('📱 Sending WhatsApp verification to:', cleanPhoneNumber)
    console.log('📝 Message body:', messageBody)

    const response = await fetch(`${WHATSAPP_API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'D360-API-KEY': API_KEY,
      },
      body: JSON.stringify(messageBody)
    })

    console.log('📱 WhatsApp response status:', response.status)
    const responseData = await response.json()
    console.log('📱 WhatsApp response data:', responseData)

    if (response.ok) {
      console.log('✅ WhatsApp verification sent successfully')
      return new Response(
        JSON.stringify({
          success: true,
          messageId: responseData.messages?.[0]?.id,
          data: responseData
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('❌ Failed to send WhatsApp verification:', responseData)
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('💥 Error sending WhatsApp verification:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
