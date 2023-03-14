import type { User } from '@prisma/client'

import { UseCase } from './use-case'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFound } from './errors/resource-not-found'

type GetUserProfileUseCaseRequest = {
  userId: string
}

type GetUserProfileUseCaseResponse = {
  user: User
}

export class GetUserProfileUseCase
  implements
    UseCase<GetUserProfileUseCaseRequest, GetUserProfileUseCaseResponse>
{
  constructor(private usersRepository: UsersRepository) {}

  async run({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFound()
    }

    return { user }
  }
}
