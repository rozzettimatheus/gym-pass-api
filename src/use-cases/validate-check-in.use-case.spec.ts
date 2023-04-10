import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/implementations/in-memory/in-memory-check-ins.repository'
import { ValidateCheckInUseCase } from './validate-check-in.use-case'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

import { IDateProvider } from '@/providers/date/contracts/date.provider'
import { DayJSDateProvider } from '@/providers/date/implementations/day-js.provider'

let dateProvider: IDateProvider
let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    dateProvider = new DayJSDateProvider()
    checkInsRepository = new InMemoryCheckInsRepository(dateProvider)
    sut = new ValidateCheckInUseCase(checkInsRepository, dateProvider)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user_01',
    })

    const { checkIn } = await sut.run({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate a non-existing check in', async () => {
    await expect(() =>
      sut.run({ checkInId: 'non-existing-check-in-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const testDate = new Date(2023, 0, 1, 13, 40) // UTC
    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.setSystemTime(testDate)

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user_01',
    })

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.run({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
