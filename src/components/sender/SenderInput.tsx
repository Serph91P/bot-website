'use client'

import { useState, FormEvent } from 'react'

interface SenderInputProps {
  onSubmit: (senderName: string) => Promise<void>
  isLoading: boolean
}

export default function SenderInput({ onSubmit, isLoading }: SenderInputProps) {
  const [senderName, setSenderName] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (senderName.trim()) {
      await onSubmit(senderName.trim())
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Sender prüfen
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Geben Sie den Namen des Senders ein, den Sie überprüfen möchten.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="sender"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Sendername
          </label>
          <input
            id="sender"
            name="sender"
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="input-field"
            placeholder="z.B. ARD, ZDF, RTL..."
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !senderName.trim()}
          className="w-full btn-primary"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Wird geprüft...
            </span>
          ) : (
            'Sender prüfen'
          )}
        </button>
      </form>
    </div>
  )
}
