import dayjs from 'dayjs'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { CheckIn } from '@prisma/client'
import { LateCheckInValidationError } from './errors/late-check-in-validation'

namespace ValidateCheckIn {
  export type Params = {
    checkInId: string
  }

  export type Result = {
    checkIn: CheckIn
  }
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckIn.Params): Promise<ValidateCheckIn.Result> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
