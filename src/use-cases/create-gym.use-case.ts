import type { Gym } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IGymsRepository } from '@/repositories/protocols/gyms.repository'

type CreateGymUseCaseRequest = {
  title: string
  description?: string | null // force update
  phone: string | null
  latitude: number
  longitude: number
}

type CreateGymUseCaseResponse = {
  gym: Gym
}

export class CreateGymUseCase
  implements IUseCase<CreateGymUseCaseRequest, CreateGymUseCaseResponse>
{
  constructor(private gymsRepository: IGymsRepository) {}

  async run({
    latitude,
    longitude,
    phone,
    title,
    description,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      phone,
      title,
      description,
    })

    return { gym }
  }
}
