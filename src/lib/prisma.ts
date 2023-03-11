import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const client = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
