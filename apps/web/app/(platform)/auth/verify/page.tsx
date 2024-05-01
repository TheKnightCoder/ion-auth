import { Icons } from '@/components/icons'
import OTP from './otp'
import { ErrorToast } from '@/components/error-toast'
import { ResendEmailLink } from './resend-email-link'
import { getAuthLinks } from '../authLinks'

export default async function VerifyPage() {
  const { codeVerifyLink, codeAuthLink } = getAuthLinks()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
          <p className="text-sm text-muted-foreground">
            To login check your email, it may take 1-2 minutes. Please <b>check your spam folder</b> if it doesn&apost
            arrive.
          </p>
          <OTP codeVerifyLink={codeVerifyLink} />
          <ResendEmailLink codeAuthLink={codeAuthLink} />
          <ErrorToast />
        </div>
      </div>
    </div>
  )
}
