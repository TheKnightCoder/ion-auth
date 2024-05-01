'use client'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function OTP({ codeVerifyLink }) {
  const searchParams = useSearchParams()

  const router = useRouter()
  const [otp, setOtp] = useState(searchParams.get('code') || '')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.log('otp')

    console.log(otp.length)
    if (otp.length === 6) {
      router.push(`${codeVerifyLink}?code=${otp}`)
    }
  }, [otp, router, codeVerifyLink])

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [])

  return (
    <div>
      <div className="flex justify-center pt-4">
        <InputOTP maxLength={6} onChange={(otp) => setOtp(otp)} ref={firstInputRef}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  )
}
