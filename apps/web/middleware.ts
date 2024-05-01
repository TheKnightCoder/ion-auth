import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenSession } from '@/lib/utils/tokens'

function setHeaders(request: NextRequest, headers: Headers) {
  headers.set('x-pathname', request.nextUrl.pathname)
  headers.set('x-host-url', `${request.nextUrl.protocol}//${request.nextUrl.host}`)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/app')) {
    const session = await getTokenSession()
    if (session.type === 'public') {
      const resp = NextResponse.redirect(new URL('/auth/signin', request.url))
      setHeaders(request, resp.headers)
      return resp
    }
  }
  const requestHeaders = new Headers(request.headers)
  setHeaders(request, requestHeaders)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  // matcher: ['/:path*'],
}
