'use client'

import { useEffect } from 'react'
import { signout } from '@/server/auth'

export default function Signout() {
  useEffect(() => {
    signout()
  }, [])
}
