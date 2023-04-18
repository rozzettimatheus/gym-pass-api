import { FastifyInstance } from 'fastify'

import { search } from './search.controller'
import { nearby } from './nearby.controller'
import { create } from './create.controller'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // secured routes
  app.get('/search', search)
  app.get('/nearby', nearby)

  app.post('/', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
