import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case.factory'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { MaxDistanceReachedError } from '@/use-cases/errors/max-distance-reached.error'
import { MaxNumberOfCheckInsReachedError } from '@/use-cases/errors/max-number-of-check-ins-reached.error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = createCheckInsParamsSchema.parse(request.params)

  const checkInUseCase = makeCheckInUseCase()

  try {
    const { checkIn } = await checkInUseCase.run({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(201).send({ checkIn })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof MaxDistanceReachedError) {
      return reply.status(400).send({ message: err.message })
    }

    if (err instanceof MaxNumberOfCheckInsReachedError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
