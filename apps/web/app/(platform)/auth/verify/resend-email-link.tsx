// resend-email-link.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export const ResendEmailLink = ({ codeAuthLink }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const email = searchParams.get('email')
  console.log(email)

  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [isResent, setIsResent] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    if (countdown === 0) {
      setCanResend(true)
      clearInterval(timer)
    }

    return () => {
      clearInterval(timer)
    }
  }, [countdown])

  const handleResendEmail = () => {
    setCanResend(false)
    setIsResent(true)

    if (!email) {
      toast({
        title: 'Email is missing',
        description: 'Sign in failed. Please try again',
      })
      return router.push('/auth/signin')
    }
    toast({
      title: 'Login code sent to your email',
      description: 'Login code has been sent, check your email',
    })
    router.push(`${codeAuthLink}&email=${email}`)
  }

  return (
    <div className="text-sm text-muted-foreground pt-4 flex flex-col items-center ">
      <p className="mb-0">Didn&apos;t receive your code?</p>
      <button
        onClick={handleResendEmail}
        className={`text-sm text-muted-foreground 
        ${canResend ? 'hover:underline' : 'pointer-events-none'}
        ${isResent ? '' : ' opacity-50'}
        `}
      >
        {canResend ? 'Resend code to email' : isResent ? 'Code sent check your email' : `Resend in (${countdown}s)`}
      </button>
    </div>
  )
}
