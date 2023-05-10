import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterUseCase } from '@/use-cases/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { name, email, password } = registerBodySchema.parse(request.body)

      await this.registerUseCase.execute({
        name,
        email,
        password,
      })

      return reply.status(201).send()
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        return reply.status(409).send({ message: err.message })
      }
      throw err
    }
  }
}
