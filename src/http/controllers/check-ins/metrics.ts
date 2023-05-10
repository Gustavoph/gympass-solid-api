import { FastifyReply, FastifyRequest } from 'fastify'
import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics'

export class GetUserMetricsController {
  constructor(private readonly GetUserMetricsUseCase: GetUserMetricsUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const { checkInsCount } = await this.GetUserMetricsUseCase.execute({
      userId: request.user.sub,
    })

    return reply.status(200).send({ checkInsCount })
  }
}
