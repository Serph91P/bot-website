'use client'

import { SenderStatusUpdate } from '@/types'

interface StatusDisplayProps {
  status: SenderStatusUpdate | null
  onReset: () => void
}

export default function StatusDisplay({ status, onReset }: StatusDisplayProps) {
  if (!status) return null

  const isCompleted = status.status === 'completed'
  const isError = status.status === 'error'
  const isChecking = status.status === 'checking'

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Status
        </h2>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Neue Prüfung
        </button>
      </div>

      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center space-x-3">
          {isChecking && (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Prüfung läuft...
              </span>
            </>
          )}
          {isCompleted && (
            <>
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Prüfung abgeschlossen
              </span>
            </>
          )}
          {isError && (
            <>
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-red-600 dark:text-red-400 font-medium">
                Fehler
              </span>
            </>
          )}
        </div>

        {/* Message */}
        <div
          className={`p-4 rounded-lg ${
            isCompleted
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : isError
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <p
            className={`text-sm ${
              isCompleted
                ? 'text-green-800 dark:text-green-200'
                : isError
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}
          >
            {status.message}
          </p>
        </div>

        {/* Details */}
        {status.details && Object.keys(status.details).length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                {JSON.stringify(status.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(status.timestamp).toLocaleString('de-DE')}
        </div>
      </div>
    </div>
  )
}
