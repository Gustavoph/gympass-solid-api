import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateGymUseCase } from '@/use-cases/create-gym'

export class CreateGymController {
  constructor(private readonly createGymUseCase: CreateGymUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { title, description, latitude, longitude, phone } =
      createGymBodySchema.parse(request.body)

    await this.createGymUseCase.execute({
      title,
      phone,
      latitude,
      longitude,
      description,
    })

    return reply.status(201).send()
  }
}
