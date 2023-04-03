import { CheckIn } from '@prisma/client'

import { IUseCase } from './protocols/use-case'
import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'

type FetchUserCheckInsUseCaseRequest = {
  userId: string
  page: number
}

type FetchUserCheckInsUseCaseResponse = {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase
  implements
    IUseCase<FetchUserCheckInsUseCaseRequest, FetchUserCheckInsUseCaseResponse>
{
  constructor(private checkInRepository: ICheckInsRepository) {}

  async run({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return { checkIns }
  }
}
