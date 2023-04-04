import { expect, describe, it, beforeEach } from 'vitest'

import { IGymsRepository } from '@/repositories/protocols/gyms.repository'
import { InMemoryGymsRepository } from '@/repositories/implementations/in-memory/in-memory-gyms.repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.use-case'

let gymRepository: IGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      latitude: -21.7828621,
      longitude: -48.1855472,
      phone: null,
      description: null,
    })

    await gymRepository.create({
      title: 'Far away Gym',
      latitude: -21.1687427,
      longitude: -47.8083742,
      phone: null,
      description: null,
    })

    const { gyms } = await sut.run({
      userLatitude: -21.7828621,
      userLongitude: -48.1855472,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
