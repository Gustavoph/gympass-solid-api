import { FastifyReply, FastifyRequest } from 'fastify'
import { userRepository } from 'repositories/prisma/prisma-user.repository'
import { UserAlreadyExistsError } from 'use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from 'use-cases/register.use-case'
import { z } from 'zod'

const useCase = new RegisterUseCase(userRepository)

export async function Register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await useCase.execute({
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
