import Link from 'next/link'

import { Icons } from '@/components/icons'
import { SignInForm } from './signin-form'
import { ErrorToast } from '@/components/error-toast'
import { getAuthLinks } from '../authLinks'

export default async function LoginPage() {
  const { googleAuthLink, codeAuthLink } = getAuthLinks()
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>
        <ErrorToast />
        <SignInForm googleAuthLink={googleAuthLink} codeAuthLink={codeAuthLink} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="signup" className="hover:text-brand underline underline-offset-4">
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
