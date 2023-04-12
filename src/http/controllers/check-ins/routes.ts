import { FastifyInstance } from 'fastify'

import { create } from './create.controller'
import { validate } from './validate.controller'
import { history } from './history.controller'
import { metrics } from './metrics.controller'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // secured routes
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate', validate)
}
