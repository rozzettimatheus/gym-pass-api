import { expect, describe, it, beforeEach } from 'vitest'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { InMemoryCheckInsRepository } from '@/repositories/implementations/in-memory/in-memory-check-ins.repository'

import { GetUserMetricsUseCase } from './get-user-metrics.use-case'

let checkInsRepository: ICheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to fetch user check ins', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkInsCount } = await sut.run({ userId })

    expect(checkInsCount).toEqual(2)
  })
})
