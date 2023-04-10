import { PrismaCheckInsRepository } from '@/repositories/implementations/prisma/prisma-check-ins.repository'
import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins-history.use-case'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new FetchUserCheckInsUseCase(checkInsRepository)
}
