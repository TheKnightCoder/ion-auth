import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const siteUrl = headers().get('x-host-url') || 'http://localhost:3000'
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      throw new Error('Code missing')
    }

    const formData = new FormData()
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', process.env.CLIENT_ID!)
    formData.append('code', code)
    formData.append('redirect_uri', new URL('/api/auth/tokens', siteUrl).href)

    const response = await fetch(`${process.env.AUTH_URL}/token`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      throw new Error('Non-OK HTTP status code')
    }
    console.log('response is ok')

    const data = await response.json()
    const token = data.access_token

    const HOURS = 60 * 60
    const cookieStore = cookies()
    cookieStore.set('auth_token', token, {
      maxAge: 30 * 24 * HOURS,
      path: '/',
    })

    return NextResponse.redirect(new URL('/app', siteUrl))
  } catch (error: any) {
    console.log(JSON.stringify(error))
    return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', siteUrl))
  }
}
