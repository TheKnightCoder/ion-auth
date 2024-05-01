import { email, minLength, object, parse, string } from 'valibot'
import { Input } from 'valibot'

export const userAuthSchema = object({
  email: string([minLength(1, 'Please enter your email'), email('The email you entered is invalid')]),
})
export type userAuthSchemaType = Input<typeof userAuthSchema>
