import { AuthHandler } from 'sst/auth'
import { sessions } from '../lib/sessions'
import { handle } from 'hono/aws-lambda'
import { User } from '../lib/model/user'
import { hasExceededMaxOtpAttempts } from '../lib/model/otp-attempt'
import { codeAdapter } from '../lib/code-adapter'
import { GoogleAdapter } from 'sst/auth/adapter'

export const app = AuthHandler({
  session: sessions,
  providers: {
    code: codeAdapter,
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: process.env.GOOGLE_CLIENT_ID!,
    }),
  },
  callbacks: {
    auth: {
      async error(error, req) {
        const siteUrl = process.env.SITE_URL!
        console.error(error)

        return new Response('ok', {
          status: 302,
          headers: {
            Location: `${siteUrl}/auth/signin?error=unauthorized`,
          },
        })
      },
      async allowClient(clientID, redirect, req) {
        const siteUrl = process.env.SITE_URL!

        if (clientID !== process.env.CLIENT_ID!) {
          console.log('Invalid client ID', clientID)
          return false
        }
        if (redirect !== `${siteUrl}/api/auth/tokens`) {
          console.log(`Invalid redirect ${redirect} not equal to ${siteUrl}/api/auth/tokens`)
          return false
        }
        console.log('client allowed')
        return true
      },
      async success(ctx, input, req) {
        const siteUrl = process.env.SITE_URL!

        const redirectResponse = new Response('ok', {
          status: 302,
          headers: {
            Location: `${siteUrl}/auth/signin?error=unauthorized`,
          },
        })
        try {
          let email
          if (input.provider === 'code') {
            email = input.claims.email

            if (await hasExceededMaxOtpAttempts(email)) {
              return new Response('ok', {
                status: 302,
                headers: {
                  Location: `${siteUrl}/auth/signin?error=code_too_many_attempts`,
                },
              })
            }
          } else if (input.provider === 'google') {
            email = input.tokenset.claims().email
            if (!email) {
              console.log('Unauthorized')
              return redirectResponse
            }
          } else {
            console.log('Invalid provider')
            return redirectResponse
          }

          let user = await User.get({
            email,
          }).go()

          // Auto sign up
          if (!user.data) {
            user = await User.create({
              email,
            }).go()
            console.log('user created')
          }

          if (!user.data) {
            console.log('Unauthorized')
            return redirectResponse
          }

          const HOURS = 60 * 60 * 1000
          return ctx.session({
            type: 'user',
            expiresIn: 30 * 24 * HOURS,
            properties: {
              userId: user.data.userId,
              email: user.data.email,
            },
          })
        } catch (error) {
          console.log(error)
          return redirectResponse
        }
      },
    },
  },
})

export const handler = handle(app as any)
