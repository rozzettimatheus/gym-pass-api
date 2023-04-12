import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.factory'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation.error'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)
  const validateCheckInUseCase = makeValidateCheckInUseCase()

  try {
    await validateCheckInUseCase.run({ checkInId })
    return reply.status(204).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
    }
    if (err instanceof LateCheckInValidationError) {
    }

    throw err
  }
}
