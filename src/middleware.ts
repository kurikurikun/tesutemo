import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /lite/internal routes
  if (pathname.startsWith('/lite/internal')) {
    const authHeader = req.headers.get('authorization')

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(' ')
      if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
        const [user, pass] = decoded.split(':')
        const validUser = process.env.INTERNAL_USER ?? 'admin'
        const validPass = process.env.INTERNAL_PASS ?? ''
        if (user === validUser && pass === validPass && validPass !== '') {
          return NextResponse.next()
        }
      }
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="TesuTemo Internal"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/lite/internal', '/lite/internal/:path*'],
}
