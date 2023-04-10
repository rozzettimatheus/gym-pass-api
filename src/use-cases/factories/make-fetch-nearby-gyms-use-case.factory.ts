import { PrismaGymsRepository } from '@/repositories/implementations/prisma/prisma-gyms.repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms.use-case'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  return new FetchNearbyGymsUseCase(gymsRepository)
}
