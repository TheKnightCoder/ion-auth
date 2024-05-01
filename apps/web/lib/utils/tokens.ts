import { cookies } from 'next/headers'
import * as jose from 'jose'
import { log } from 'console'

// Define or update the session type
interface Session extends jose.JWTPayload {
  type: 'public' | 'user'
  properties: {
    userId?: string
    email?: string
  }
}

export function getToken() {
  const cookie = cookies().get('auth_token')
  return cookie && cookie.value
}

export function getHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function verifyToken(token?: string): Promise<Session> {
  if (token) {
    try {
      const publicKey = await jose.importSPKI(process.env.AUTH_PUBLIC_KEY!, 'RS512')
      const { payload } = await jose.jwtVerify(token, publicKey)
      return payload as Session
    } catch (e) {}
  }
  return {
    type: 'public',
    properties: {},
  }
}

export async function getTokenSession(): Promise<Session> {
  const token = getToken()
  const session = await verifyToken(token)
  return session
}
