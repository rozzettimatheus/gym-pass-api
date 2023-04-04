import type { Gym } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IGymsRepository } from '@/repositories/protocols/gyms.repository'

type FetchNearbyGymsUseCaseRequest = {
  userLatitude: number
  userLongitude: number
}

type FetchNearbyGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase
  implements
    IUseCase<FetchNearbyGymsUseCaseRequest, FetchNearbyGymsUseCaseResponse>
{
  constructor(private gymsRepository: IGymsRepository) {}

  async run({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
