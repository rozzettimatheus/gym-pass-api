import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'

import { env } from '@/env'
import { usersRoutes } from '@/http/controllers/users/routes'
import { gymsRoutes } from '@/http/controllers/gyms/routes'
import { checkInsRoutes } from '@/http/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refresh_token',
    signed: false, // not a signed cookie (not hashed)
  },
  sign: {
    expiresIn: '15m',
  },
})
app.register(fastifyCookie)

app.register(usersRoutes, { prefix: '/api' })
app.register(gymsRoutes, { prefix: '/api/gyms' })
app.register(checkInsRoutes, { prefix: '/api' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: set Sentry/DataDog...
  }

  return reply.status(500).send({ message: 'internal server error' })
})
