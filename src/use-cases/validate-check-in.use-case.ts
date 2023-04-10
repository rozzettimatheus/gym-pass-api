import { CheckIn } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { IDateProvider } from '@/providers/date/contracts/date.provider'
import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

type ValidateCheckInUseCaseRequest = {
  checkInId: string
}

type ValidateCheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase
  implements
    IUseCase<ValidateCheckInUseCaseRequest, ValidateCheckInUseCaseResponse>
{
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private dateProvider: IDateProvider,
  ) {}

  async run({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const diffInMinutesFromCheckInCreation = this.dateProvider.getDiffInMinutes(
      new Date(),
      checkIn.created_at,
    )

    if (diffInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
