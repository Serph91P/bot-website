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
    const { senderId } = body

    if (!senderId || typeof senderId !== 'string') {
      return NextResponse.json(
        { error: 'Sender ID is required' },
        { status: 400 }
      )
    }

    const result = await n8nClient.selectSender(senderId, session.user.embyId)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error selecting sender:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
