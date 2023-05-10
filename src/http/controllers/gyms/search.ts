import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'

export class SearchGymController {
  constructor(private readonly searchGymsUseCase: SearchGymsUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const createGymsQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = createGymsQuerySchema.parse(request.query)

    const { gyms } = await this.searchGymsUseCase.execute({
      query: q,
      page,
    })

    return reply.status(201).send({ gyms })
  }
}
