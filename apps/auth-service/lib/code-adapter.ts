import { CodeAdapter } from 'sst/auth/adapter'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { email, minLength, object, parse, string } from 'valibot'
import { OtpAttempt } from './model/otp-attempt'
import { OtpSent } from './model/otp-sent-time'
import { hasExceededMaxOtpAttempts } from './model/otp-attempt'

const ses = new SESv2Client({})

const claimsSchema = object({
  email: string([minLength(1, 'Please enter your email'), email('The email you entered is invalid')]),
})

export const codeAdapter = CodeAdapter({
  async onCodeRequest(code, unvalidatedClaims, req) {
    const siteUrl = process.env.SITE_URL

    const claims = parse(claimsSchema, unvalidatedClaims)
    const email = claims.email

    const otpSent = await OtpSent.get({
      email,
    }).go()

    if (otpSent.data && otpSent.data.updatedAt + 30 * 1000 > Date.now()) {
      return new Response('ok', {
        status: 302,
        headers: {
          Location: `${siteUrl}/auth/verify?error=code_not_sent&email=${email}`,
        },
      })
    }

    const cmd = new SendEmailCommand({
      Destination: {
        ToAddresses: [claims.email],
      },
      FromEmailAddress: `Web App Login <${process.env.SENDER_EMAIL}>`,
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: `
              Hi!,
              <br/><br/>
              Enter the code <strong>${code}</strong> or click the link below to sign in. 
              <br/><br/> 
              <a href="${siteUrl}/auth/verify?email=${email}&code=${code}">Sign In</a>
              `,
            },
            Text: {
              Data: `Enter the code <strong>${code}</strong> to sign in.`,
            },
          },
          Subject: {
            Data: `[LOGIN CODE] ${code}`,
          },
        },
      },
    })
    await ses.send(cmd)

    await OtpSent.upsert({
      email: claims.email,
      updatedAt: Date.now(),
    }).go()

    return new Response('ok', {
      status: 302,
      headers: {
        location: `${siteUrl}/auth/verify?email=${claims.email}`,
      },
    })
  },
  async onCodeInvalid(code, claims, req) {
    const siteUrl = process.env.SITE_URL

    const email = claims.email
    await OtpAttempt.create({
      email,
    }).go()

    if (await hasExceededMaxOtpAttempts(email)) {
      return new Response('ok', {
        status: 302,
        headers: {
          Location: `${siteUrl}/auth/signin?error=code_too_many_attempts`,
        },
      })
    }

    return new Response('ok', {
      status: 302,
      headers: {
        location: `${siteUrl}/auth/verify?error=invalid_code&email=${claims.email}`,
      },
    })
  },
})
