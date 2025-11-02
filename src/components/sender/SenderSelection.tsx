'use client'

import { Sender } from '@/types'

interface SenderSelectionProps {
  senders: Sender[]
  onSelect: (senderId: string) => Promise<void>
  isLoading: boolean
}

export default function SenderSelection({
  senders,
  onSelect,
  isLoading,
}: SenderSelectionProps) {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Mehrere Sender gefunden
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Bitte wählen Sie den gewünschten Sender aus der Liste aus.
      </p>

      <div className="space-y-3">
        {senders.map((sender) => (
          <button
            key={sender.id}
            onClick={() => onSelect(sender.id)}
            disabled={isLoading}
            className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                {sender.name}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
