import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class AuthenticateController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { email, password } = authenticateBodySchema.parse(request.body)

      const { user } = await this.authenticateUseCase.execute({
        email,
        password,
      })

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      )

      return reply.status(200).send({ accessToken: token })
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(400).send({ message: err.message })
      }
      throw err
    }
  }
}
