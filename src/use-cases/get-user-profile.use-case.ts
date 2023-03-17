import type { User } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

type GetUserProfileUseCaseRequest = {
  userId: string
}

type GetUserProfileUseCaseResponse = {
  user: User
}

export class GetUserProfileUseCase
  implements
    IUseCase<GetUserProfileUseCaseRequest, GetUserProfileUseCaseResponse>
{
  constructor(private usersRepository: IUsersRepository) {}

  async run({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
