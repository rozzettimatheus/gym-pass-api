import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { GetUserMetricsUseCase } from '../get-user-metrics.use-case'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new GetUserMetricsUseCase(checkInsRepository)
}
