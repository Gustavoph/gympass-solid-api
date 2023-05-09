import { CheckInsRepository } from '@/repositories/check-ins-repository'

namespace GetUserMetrics {
  export type Params = {
    userId: string
  }
  export type Result = {
    checkInsCount: number
  }
}

export class GetUserMetricsUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetrics.Params): Promise<GetUserMetrics.Result> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
