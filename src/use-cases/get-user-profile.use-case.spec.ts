import { expect, describe, it, beforeEach } from 'vitest'

import { IUsersRepository } from '@/repositories/protocols/users.repository'
import { InMemoryUsersRepository } from '@/repositories/implementations/in-memory/in-memory-users.repository'
import { GetUserProfileUseCase } from './get-user-profile.use-case'
import { ResourceNotFoundError } from './errors/resource-not-found'

let repository: IUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(repository)
  })

  it('should be able to get user profile by id', async () => {
    const user = await repository.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: '123456',
    })

    const { user: expectedUser } = await sut.run({ userId: user.id })

    expect(expectedUser.id).toEqual(user.id)
    expect(expectedUser.name).toEqual(user.name)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.run({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
