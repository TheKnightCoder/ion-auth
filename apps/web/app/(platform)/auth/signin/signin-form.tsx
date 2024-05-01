'use client'

import * as React from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { userAuthSchema, userAuthSchemaType } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import Link from 'next/link'

import { useRouter } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  googleAuthLink: string
  codeAuthLink: string
}

export function SignInForm({ className, googleAuthLink, codeAuthLink, ...props }: UserAuthFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<userAuthSchemaType>({
    resolver: valibotResolver(userAuthSchema),
  })

  async function onSubmit(data: userAuthSchemaType) {
    router.push(`${codeAuthLink}&email=${data.email}`)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...register('email')}
            />
            {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <Button className="w-full" disabled={!isValid}>
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Link href={googleAuthLink} passHref>
        <Button variant="outline" className="w-full">
          <Icons.google className="mr-2" />
          Google
        </Button>
      </Link>
    </div>
  )
}
