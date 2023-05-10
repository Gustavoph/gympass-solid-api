import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { FetchUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'

export class CheckInHistoryController {
  constructor(
    private readonly fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase,
  ) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { page } = z
      .object({
        page: z.coerce.number().min(1).default(1),
      })
      .parse(request.query)

    const { checkIns } = await this.fetchUserCheckInsHistoryUseCase.execute({
      page,
      userId: request.user.sub,
    })

    return reply.status(200).send({ checkIns })
  }
}
