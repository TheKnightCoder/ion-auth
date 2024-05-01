import { createSessionBuilder } from 'sst/auth'

export const sessions = createSessionBuilder<{
  user: {
    userId: string
    email: string
  }
}>()
