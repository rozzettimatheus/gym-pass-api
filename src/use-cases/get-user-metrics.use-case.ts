import { IUseCase } from './protocols/use-case'
import { ICheckInsRepository } from '@/repositories/protocols/check-ins.repository'

type GetUserMetricsUseCaseRequest = {
  userId: string
}

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase
  implements
    IUseCase<GetUserMetricsUseCaseRequest, GetUserMetricsUseCaseResponse>
{
  constructor(private checkInRepository: ICheckInsRepository) {}

  async run({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
