import { expect, describe, it, beforeEach } from 'vitest'

import { IGymsRepository } from '@/repositories/protocols/gyms.repository'
import { InMemoryGymsRepository } from '@/repositories/implementations/in-memory/in-memory-gyms.repository'

import { SearchGymsUseCase } from '@/use-cases/search-gyms.use-case'

let gymRepository: IGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      title: 'Javascript Gym',
      latitude: -21.7828621,
      longitude: -48.1855472,
      phone: null,
      description: null,
    })

    await gymRepository.create({
      title: 'Typescript Gym',
      latitude: -21.7828621,
      longitude: -48.1855472,
      phone: null,
      description: null,
    })

    const { gyms } = await sut.run({ query: 'Javascript', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Typescript Gym ${i}`,
        latitude: -21.7828621,
        longitude: -48.1855472,
        phone: null,
        description: null,
      })
    }
    const { gyms } = await sut.run({ query: 'Typescript', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym 21' }),
      expect.objectContaining({ title: 'Typescript Gym 22' }),
    ])
  })
})
