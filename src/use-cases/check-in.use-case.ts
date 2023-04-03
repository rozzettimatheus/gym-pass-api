import { CheckIn } from '@prisma/client'

import { IUseCase } from './protocols/use-case'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { IGymsRepository } from '@/repositories/protocols/gyms.repository'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { MaxDistanceReachedError } from './errors/max-distance-reached.error'
import { MaxNumberOfCheckInsReachedError } from './errors/max-number-of-check-ins-reached.error'

type CheckInUseCaseRequest = {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase
  implements IUseCase<CheckInUseCaseRequest, CheckInUseCaseResponse>
{
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async run({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates({
      from: { latitude: userLatitude, longitude: userLongitude },
      to: {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    })

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceReachedError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsReachedError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
