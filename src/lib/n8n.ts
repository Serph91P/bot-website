import axios from 'axios'
import {
  N8nWebhookPayload,
  SenderCheckResponse,
  N8nCallbackPayload,
} from '@/types'

class N8nClient {
  private webhookUrl: string

  constructor() {
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL is not configured')
    }

    this.webhookUrl = webhookUrl
  }

  /**
   * Send sender check request to n8n
   */
  async checkSender(
    senderName: string,
    userId: string
  ): Promise<SenderCheckResponse> {
    try {
      const payload: N8nWebhookPayload = {
        senderName,
        userId,
      }

      const response = await axios.post<SenderCheckResponse>(
        this.webhookUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to check sender with n8n:', error)
      return {
        status: 'error',
        message: 'Fehler bei der Kommunikation mit dem Server',
      }
    }
  }

  /**
   * Confirm sender selection (when multiple senders found)
   */
  async selectSender(
    senderId: string,
    userId: string
  ): Promise<SenderCheckResponse> {
    try {
      // For sender selection, we use the same webhook URL
      // The n8n workflow will handle both actions based on the payload
      const response = await axios.post<SenderCheckResponse>(
        this.webhookUrl,
        {
          senderId,
          userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to select sender:', error)
      return {
        status: 'error',
        message: 'Fehler bei der Sender-Auswahl',
      }
    }
  }

  /**
   * Validate n8n callback signature
   */
  static validateCallback(payload: N8nCallbackPayload, signature?: string): boolean {
    const secret = process.env.N8N_CALLBACK_SECRET
    if (!secret || !signature) {
      return false
    }

    // Implement HMAC signature validation here
    // For now, we'll use a simple secret comparison
    return signature === secret
  }
}

export const n8nClient = new N8nClient()
