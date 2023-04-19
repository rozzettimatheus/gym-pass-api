import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'

import { client } from '@/lib/prisma'

type CreateUserParams = {
  email?: string
  name?: string
  password?: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user?: CreateUserParams | undefined,
  isAdmin = false,
) {
  await client.user.create({
    data: {
      name: user?.name ?? 'John Doe',
      email: user?.email ?? 'johndoe@example.com',
      password_hash: await hash(user?.password ?? '123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: user?.email ?? 'johndoe@example.com',
      password: user?.password ?? '123456',
    })

  const { token } = authResponse.body

  return { token }
}
