// Auth Types
export interface EmbyUser {
  Id: string
  Name: string
  ServerId: string
  HasPassword: boolean
  HasConfiguredPassword: boolean
  HasConfiguredEasyPassword: boolean
  EnableAutoLogin?: boolean
  LastLoginDate?: string
  LastActivityDate?: string
}

export interface EmbyAuthResponse {
  User: EmbyUser
  SessionInfo: {
    Id: string
  }
  AccessToken: string
  ServerId: string
}

// Sender Types
export interface Sender {
  id: string
  name: string
  logoUrl?: string
}

export interface SenderCheckRequest {
  senderName: string
}

export interface SenderCheckResponse {
  status: 'checking' | 'multiple' | 'error'
  senderId?: string
  senderName?: string
  senders?: Sender[]
  message?: string
}

export interface SenderStatusUpdate {
  senderId: string
  status: 'checking' | 'completed' | 'error'
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

// n8n Types
export interface N8nWebhookPayload {
  senderName: string
  userId: string
}

export interface N8nCallbackPayload {
  senderId: string
  status: 'completed' | 'error'
  message: string
  details?: Record<string, unknown>
}

// Session Types
export interface SessionUser {
  id: string
  name: string
  embyId: string
  accessToken: string
}
