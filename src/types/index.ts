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
  senderId?: string
  stream_id?: number
  user_id?: string
  status?: 'completed' | 'error'
  message?: string
  live?: boolean
  stable?: boolean
  quality?: string
  avg_latency_ms?: number
  output?: string
  checks?: number
  failed_checks?: number
  stream_type?: string
  total_frames?: number
  avg_frames?: number
  min_frames?: number
  max_frames?: number
  frame_variance?: number
  frame_variance_pct?: number
  connect_ms?: number
  test_duration_s?: number
  details?: Record<string, unknown>
}

// Session Types
export interface SessionUser {
  id: string
  name: string
  embyId: string
  accessToken: string
}
