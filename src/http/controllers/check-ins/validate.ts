import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation'
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in'

export class ValidateCheckInController {
  constructor(
    private readonly validateCheckInUseCase: ValidateCheckInUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { checkInId } = z
        .object({
          checkInId: z.string().uuid(),
        })
        .parse(request.params)

      await this.validateCheckInUseCase.execute({
        checkInId,
      })

      return reply.status(204).send()
    } catch (error) {
      if (
        error instanceof ResourceNotFoundError ||
        error instanceof LateCheckInValidationError
      ) {
        return reply.status(400).send({ message: error.message })
      }

      throw error
    }
  }
}
