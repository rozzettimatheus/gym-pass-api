import { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { register } from './register.controller'
import { refresh } from './refresh.controller'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)

  /**
   * 3 estrategias
   *
   * - basic auth: send authorization
   *    Basic {credentials in base64 in format user:password}
   * - JWT
   *    JWT: JSON Web Token
   *    -> email/password => backend creates a UNIQUE token, unchangeable and STATELESS (not persistent in the DB)
   *    -> header.payload.sign
   */
}
