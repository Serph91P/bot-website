import axios, { AxiosInstance } from 'axios'
import { EmbyAuthResponse } from '@/types'

class EmbyClient {
  private client: AxiosInstance

  constructor() {
    const serverUrl = process.env.EMBY_SERVER_URL
    if (!serverUrl) {
      throw new Error('EMBY_SERVER_URL is not configured')
    }

    this.client = axios.create({
      baseURL: serverUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Authenticate user with Emby credentials
   */
  async authenticateByName(
    username: string,
    password: string
  ): Promise<EmbyAuthResponse | null> {
    try {
      const response = await this.client.post<EmbyAuthResponse>(
        '/Users/AuthenticateByName',
        {
          Username: username,
          Pw: password,
        },
        {
          headers: {
            'X-Emby-Authorization': `MediaBrowser Client="Bot Website", Device="Web", DeviceId="bot-website-${Date.now()}", Version="1.0.0"`,
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Emby authentication failed:', error)
      return null
    }
  }

  /**
   * Validate an existing access token
   */
  async validateToken(userId: string, accessToken: string): Promise<boolean> {
    try {
      const response = await this.client.get(`/Users/${userId}`, {
        headers: {
          'X-Emby-Token': accessToken,
        },
      })

      return response.status === 200
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }

  /**
   * Get user information by ID
   */
  async getUserById(userId: string, accessToken: string) {
    try {
      const response = await this.client.get(`/Users/${userId}`, {
        headers: {
          'X-Emby-Token': accessToken,
        },
      })

      return response.data
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }
}

export const embyClient = new EmbyClient()
