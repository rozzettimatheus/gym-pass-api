import request from 'supertest'
import { FastifyInstance } from 'fastify'

type CreateUserParams = {
  name: string
  email: string
  password: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  user: CreateUserParams,
) {
  await request(app.server).post('/users').send(user)

  const authResponse = await request(app.server).post('/sessions').send({
    email: user.email,
    password: user.password,
  })

  const { token } = authResponse.body

  return { token }
}
