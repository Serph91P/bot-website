import { NextRequest, NextResponse } from 'next/server'
import { statusStore } from '@/lib/status-store'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ senderId: string }> }
) {
  try {
    const { senderId } = await params

    // Check if we have a status update for this sender
    const status = statusStore.get(senderId)

    if (!status) {
      return NextResponse.json(
        { error: 'Status not found' },
        { status: 404 }
      )
    }

    // Format the response
    const response = {
      status: status.live === false ? 'error' : 'completed',
      message: status.output || (status.live ? '✅ Sender ist online' : '❌ Sender ist offline'),
      details: {
        live: status.live,
        stable: status.stable,
        quality: status.quality,
        avg_latency_ms: status.avg_latency_ms,
        stream_type: status.stream_type,
        checks: status.checks,
        failed_checks: status.failed_checks,
        test_duration_s: status.test_duration_s,
      },
    }

    // Clear the status after retrieval
    statusStore.delete(senderId)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
