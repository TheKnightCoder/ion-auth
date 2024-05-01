'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signout() {
  cookies().set({
    name: 'auth_token',
    value: '',
    expires: new Date(0),
  })
  redirect('/auth/signin')
}
