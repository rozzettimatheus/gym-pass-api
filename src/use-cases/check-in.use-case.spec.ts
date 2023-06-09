import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { CheckInUseCase } from './check-in.use-case'

import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'
import { InMemoryCheckInsRepository } from '@/repositories/implementations/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository } from '@/repositories/implementations/in-memory/in-memory-gyms.repository'

import { MaxNumberOfCheckInsReachedError } from './errors/max-number-of-check-ins-reached.error'
import { MaxDistanceReachedError } from './errors/max-distance-reached.error'
import { IDateProvider } from '@/providers/date/contracts/date.provider'
import { DayJSDateProvider } from '@/providers/date/implementations/day-js.provider'

let dateProvider: IDateProvider
let checkInsRepository: ICheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const BASE_LAT = -21.7828621
const BASE_LON = -48.1855472

describe('Check In Use Case', () => {
  beforeEach(async () => {
    dateProvider = new DayJSDateProvider()
    checkInsRepository = new InMemoryCheckInsRepository(dateProvider)
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(BASE_LAT),
      longitude: new Decimal(BASE_LON),
    })

    // enable vitest date mocking
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.run({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: BASE_LAT,
      userLongitude: BASE_LON,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  /**
   * TDD (make it simple)
   * Red => erro in test
   * Green => code enough to pass test
   * Refactor
   */
  it('should not be able to check in twice on the same date', async () => {
    // set a fixed date
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // first check-in
    const userId = 'user-id'
    const gymId = 'gym-id'
    await sut.run({
      gymId,
      userId,
      userLatitude: BASE_LAT,
      userLongitude: BASE_LON,
    })

    await expect(() =>
      sut.run({
        gymId,
        userId,
        userLatitude: BASE_LAT,
        userLongitude: BASE_LON,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsReachedError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // first check-in
    const userId = 'user-id'
    const gymId = 'gym-id'
    await sut.run({
      gymId,
      userId,
      userLatitude: BASE_LAT,
      userLongitude: BASE_LON,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.run({
      gymId,
      userId,
      userLatitude: BASE_LAT,
      userLongitude: BASE_LON,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-id-2',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-21.749463),
      longitude: new Decimal(-48.1424173),
    })

    await expect(() =>
      sut.run({
        gymId: 'gym-id-2',
        userId: 'user-id',
        userLatitude: BASE_LAT,
        userLongitude: BASE_LON,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceReachedError)
  })
})
