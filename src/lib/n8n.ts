import axios, { AxiosInstance } from 'axios'
import {
  N8nWebhookPayload,
  SenderCheckResponse,
  N8nCallbackPayload,
} from '@/types'

class N8nClient {
  private client: AxiosInstance

  constructor() {
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL is not configured')
    }

    this.client = axios.create({
      baseURL: webhookUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    })
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

      const response = await this.client.post<SenderCheckResponse>(
        '/sender-search',
        payload
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
      const response = await this.client.post<SenderCheckResponse>(
        '/sender-confirm',
        {
          senderId,
          userId,
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
