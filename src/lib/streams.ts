import { API_URL } from '@/utils/constants'
import type { SAVED_STREAM_TYPE, STREAM_TICKET_TYPE } from '@/utils/types'

/** A connect request the backend rejected; `status` is the HTTP status code. */
export class StreamRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'StreamRequestError'
    this.status = status
  }
}

/**
 * Asks the backend to open an RTSP stream and returns the ticket for its video
 * WebSocket. With an access token the URL is also saved to the user's streams.
 */
export async function connectStream(url: string, accessToken: string | null): Promise<STREAM_TICKET_TYPE> {
  const response = await fetch(`${API_URL}/api/streams/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new StreamRequestError(body?.error ?? 'The server could not open this stream', response.status)
  }
  return (await response.json()) as STREAM_TICKET_TYPE
}

/** Removes a stream from the logged-in user's saved history. */
export async function deleteStream(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/streams/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  // 404 means it is already gone, which is the outcome we wanted.
  if (!response.ok && response.status !== 404) {
    throw new StreamRequestError('Could not remove the stream from your history', response.status)
  }
}

/** Returns the streams saved to the logged-in user's account. */
export async function listStreams(accessToken: string): Promise<SAVED_STREAM_TYPE[]> {
  const response = await fetch(`${API_URL}/api/streams`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    throw new StreamRequestError('Could not load your saved streams', response.status)
  }
  return (await response.json()) as SAVED_STREAM_TYPE[]
}
