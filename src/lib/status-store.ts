/**
 * In-memory status store for n8n callbacks
 * In production, replace this with Redis or a database
 */

export interface StatusData {
  stream_id?: number
  user_id?: string
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
  [key: string]: unknown
}

class StatusStore {
  private store = new Map<string, StatusData>()

  set(senderId: string, data: StatusData): void {
    this.store.set(senderId, data)
    console.log(`[StatusStore] Stored status for sender ${senderId}`)
  }

  get(senderId: string): StatusData | undefined {
    return this.store.get(senderId)
  }

  delete(senderId: string): boolean {
    return this.store.delete(senderId)
  }

  has(senderId: string): boolean {
    return this.store.has(senderId)
  }
}

// Singleton instance
export const statusStore = new StatusStore()
