import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case.factory'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateSchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.run({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '5d',
        },
      },
    )

    return reply
      .status(200)
      .setCookie('refresh_token', refreshToken, {
        path: '/',
        secure: true, // HTTPS
        sameSite: true, // same domain
        httpOnly: true, // accessible only in back-end
      })
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
