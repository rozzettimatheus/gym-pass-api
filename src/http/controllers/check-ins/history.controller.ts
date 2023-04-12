import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case.factory'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const historyUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await historyUseCase.run({
    page,
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkIns,
  })
}
