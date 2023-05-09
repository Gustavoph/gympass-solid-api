import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

namespace FetchUserCheckInsHistory {
  export type Params = {
    userId: string
    page: number
  }
  export type Result = {
    checkIns: CheckIn[]
  }
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    page,
    userId,
  }: FetchUserCheckInsHistory.Params): Promise<FetchUserCheckInsHistory.Result> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
