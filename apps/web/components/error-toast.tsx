'use client'

import * as React from 'react'

import { useToast } from '@/components/ui/use-toast'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Suspense } from 'react'

function Toast() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { toast } = useToast()

  useEffect(() => {
    if (error === 'unauthorized') {
      setTimeout(() => {
        toast({
          title: 'Unauthorized.',
          description: 'Sign in failed. Please try again',
        })
      })
    } else if (error === 'invalid_code') {
      setTimeout(() => {
        toast({
          title: 'Invalid Code.',
          description: 'Your login code was invalid. Please check for the latest code send to your email and try again',
        })
      })
    } else if (error === 'code_not_sent') {
      setTimeout(() => {
        toast({
          title: 'Code not sent',
          description: 'Too many code requests, please try again in 30 seconds.',
        })
      })
    } else if (error === 'code_too_many_attempts') {
      setTimeout(() => {
        toast({
          title: 'Too many login attempts',
          description: 'Please try again after a few minutes.',
        })
      })
    }
  }, [toast, error])

  return <></>
}

export function ErrorToast() {
  //useSearchParams() should be wrapped in a suspense boundary

  return (
    <Suspense>
      <Toast />
    </Suspense>
  )
}
