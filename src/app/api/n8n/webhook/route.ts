import { NextRequest, NextResponse } from 'next/server'
import { N8nCallbackPayload } from '@/types'

/**
 * Webhook endpoint for n8n to send status updates back to the application
 * This is a public endpoint that n8n can call without authentication
 */
export async function POST(req: NextRequest) {
  try {
    // const signature = req.headers.get('x-n8n-signature')
    const body: N8nCallbackPayload = await req.json()

    // Validate signature (optional but recommended)
    // if (!N8nClient.validateCallback(body, signature || '')) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    // }

    // In a production app, you would store this in a database or use Server-Sent Events
    // to push the update to the client in real-time
    // For now, we just log it
    console.log('Received n8n callback:', body)

    // You could store the status update in a database here
    // or use a real-time mechanism like WebSockets or SSE to notify the client

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing n8n webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
