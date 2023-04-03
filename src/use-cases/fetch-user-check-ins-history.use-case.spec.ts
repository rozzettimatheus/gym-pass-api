import { expect, describe, it, beforeEach } from 'vitest'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { InMemoryCheckInsRepository } from '@/repositories/implementations/in-memory/in-memory-check-ins.repository'

import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history.use-case'

let checkInsRepository: ICheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch User Check-ins Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsUseCase(checkInsRepository)
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

    const { checkIns } = await sut.run({ userId, page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check ins', async () => {
    const userId = 'user-01'

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: userId,
      })
    }

    const { checkIns } = await sut.run({ userId, page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
