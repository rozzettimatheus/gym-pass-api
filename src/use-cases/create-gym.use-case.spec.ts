import { expect, describe, it, beforeEach } from 'vitest'

import { CreateGymUseCase } from './create-gym.use-case'
import { InMemoryGymsRepository } from '@/repositories/implementations/in-memory/in-memory-gyms.repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.run({
      title: 'JS Gym',
      latitude: -21.7828621,
      longitude: -48.1855472,
      phone: null,
      description: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
