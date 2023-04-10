import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate.controller'
import { profile } from './controllers/profile.controller'
import { register } from './controllers/register.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated
  app.get('/me', profile)

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
