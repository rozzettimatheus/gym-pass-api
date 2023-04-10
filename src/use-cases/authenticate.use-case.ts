import type { User } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { IComparable } from '@/providers/hash/contracts/comparable'

import { InvalidCredentialsError } from './errors/invalid-credentials.error'

type AuthenticateUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = {
  user: User
}

export class AuthenticateUseCase
  implements IUseCase<AuthenticateUseCaseRequest, AuthenticateUseCaseResponse>
{
  constructor(
    private usersRepository: IUsersRepository,
    private hashComparableProvider: IComparable,
  ) {}

  async run({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await this.hashComparableProvider.compare(
      password,
      user.password_hash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
