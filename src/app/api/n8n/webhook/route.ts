import { NextRequest, NextResponse } from 'next/server'
import { statusStore } from '@/lib/status-store'

/**
 * Webhook endpoint for n8n to send status updates back to the application
 * This is a public endpoint that n8n can call without authentication
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('Received n8n callback:', body)

    // Store the status update in memory
    if (body.stream_id) {
      const senderId = String(body.stream_id)
      statusStore.set(senderId, body)
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
