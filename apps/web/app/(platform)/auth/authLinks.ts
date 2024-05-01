import { headers } from 'next/headers'

export function getAuthLinks() {
  const siteUrl = headers().get('x-host-url') || 'http://localhost:3000'

  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID!,
    redirect_uri: `${siteUrl}/api/auth/tokens`,
    response_type: 'code',
  })
  const googleAuthLink = process.env.AUTH_URL + '/google/authorize?' + params.toString()
  const codeAuthLink = process.env.AUTH_URL + '/code/authorize?' + params.toString()
  const codeVerifyLink = process.env.AUTH_URL + '/code/callback'

  return {
    googleAuthLink,
    codeAuthLink,
    codeVerifyLink,
  }
}
