'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import SenderInput from '@/components/sender/SenderInput'
import SenderSelection from '@/components/sender/SenderSelection'
import StatusDisplay from '@/components/sender/StatusDisplay'
import { Sender, SenderStatusUpdate } from '@/types'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [senders, setSenders] = useState<Sender[]>([])
  const [status, setStatus] = useState<SenderStatusUpdate | null>(null)
  const [error, setError] = useState<string>('')

  const handleCheckSender = async (senderName: string) => {
    setIsLoading(true)
    setError('')
    setSenders([])
    setStatus(null)

    try {
      const response = await fetch('/api/n8n/check-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Sender-Prüfung')
      }

      if (data.status === 'checking') {
        // Single sender found, checking started
        setStatus({
          senderId: data.senderId,
          status: 'checking',
          message: `Der Sender "${data.senderName}" wird geprüft...`,
          timestamp: new Date().toISOString(),
        })
        // Start polling for updates (in a real app, use WebSockets or SSE)
        startPolling(data.senderId)
      } else if (data.status === 'multiple') {
        // Multiple senders found
        setSenders(data.senders || [])
      } else if (data.status === 'error') {
        setError(data.message || 'Ein Fehler ist aufgetreten')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSender = async (senderId: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/n8n/select-sender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId: String(senderId) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Sender-Auswahl')
      }

      setSenders([])
      setStatus({
        senderId: data.senderId,
        status: 'checking',
        message: `Der Sender wird geprüft...`,
        timestamp: new Date().toISOString(),
      })

      // Start polling for updates
      startPolling(senderId)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = (senderId: string) => {
    // Poll for status updates every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/n8n/status/${senderId}`)
        if (!response.ok) {
          // Status not found yet, keep polling
          return
        }

        const data = await response.json()
        
        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(pollInterval)
          setStatus({
            senderId,
            status: data.status,
            message: data.message || 'Prüfung abgeschlossen',
            timestamp: new Date().toISOString(),
            details: data.details || {},
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 2000)

    // Cleanup after 60 seconds
    setTimeout(() => {
      clearInterval(pollInterval)
    }, 60000)
  }

  const handleReset = () => {
    setSenders([])
    setStatus(null)
    setError('')
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bot Website
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Willkommen, {session?.user?.name}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-sm"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Status Display */}
          {status && <StatusDisplay status={status} onReset={handleReset} />}

          {/* Sender Selection */}
          {senders.length > 0 && (
            <SenderSelection
              senders={senders}
              onSelect={handleSelectSender}
              isLoading={isLoading}
            />
          )}

          {/* Sender Input (show when no status and no senders) */}
          {!status && senders.length === 0 && (
            <SenderInput onSubmit={handleCheckSender} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  )
}
