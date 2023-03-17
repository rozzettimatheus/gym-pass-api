import { CheckIn } from '@prisma/client'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { IUseCase } from './protocols/use-case'
import { IGymsRepository } from '@/repositories/protocols/gyms.repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

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
      throw new Error()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
