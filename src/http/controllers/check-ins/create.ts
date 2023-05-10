import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CheckInUseCase } from '@/use-cases/check-in'
import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from '@/use-cases/errors'

export class CreateCheckInController {
  constructor(private readonly checkInUseCase: CheckInUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => {
          return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
          return Math.abs(value) <= 180
        }),
      })

      const createCheckInParamsSchema = z.object({
        gymId: z.string(),
      })

      const userId = request.user.sub
      const { gymId } = createCheckInParamsSchema.parse(request.params)
      const { latitude, longitude } = createCheckInBodySchema.parse(
        request.body,
      )

      await this.checkInUseCase.execute({
        gymId,
        userId,
        userLatitude: latitude,
        userLongitude: longitude,
      })

      return reply.status(201).send()
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof MaxDistanceError ||
        error instanceof MaxNumberOfCheckInsError
      ) {
        return reply.status(400).send({ message: error.message })
      }

      throw error
    }
  }
}
