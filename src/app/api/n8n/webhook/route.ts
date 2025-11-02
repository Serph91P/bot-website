import { NextRequest, NextResponse } from 'next/server'
import { statusStore } from '@/lib/status-store'

/**
 * Webhook endpoint for n8n to send status updates back to the application
 * This is a public endpoint that n8n can call without authentication
 */
export async function POST(req: NextRequest) {
  try {
    let body = await req.json()

    console.log('Received n8n callback:', body)

    // n8n sendet manchmal ein Array, manchmal ein einzelnes Objekt
    if (Array.isArray(body) && body.length > 0) {
      body = body[0]
      console.log('Extracted first item from array:', body)
    }

    // Store the status update in memory
    // Support both stream_id and senderId for backwards compatibility
    const senderId = String(body.stream_id || body.senderId)
    
    if (senderId && senderId !== 'undefined') {
      // Parse details if it's a JSON string
      let details = body.details
      if (typeof details === 'string') {
        try {
          details = JSON.parse(details)
        } catch (e) {
          console.error('Failed to parse details JSON:', e)
          details = {}
        }
      }

      const statusData = {
        ...body,
        details,
        senderId: Number(senderId)
      }

      statusStore.set(senderId, statusData)
      console.log(`[Webhook] Stored status for sender ${senderId}:`, statusData.status)
    } else {
      console.warn('[Webhook] No senderId found in callback:', body)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing n8n webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
