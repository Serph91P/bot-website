import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { n8nClient } from '@/lib/n8n'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { senderName } = body

    if (!senderName || typeof senderName !== 'string') {
      return NextResponse.json(
        { error: 'Sender name is required' },
        { status: 400 }
      )
    }

    const result = await n8nClient.checkSender(
      senderName,
      session.user.embyId
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error checking sender:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
