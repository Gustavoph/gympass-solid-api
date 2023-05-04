import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { AuthenticateController } from './controllers/authenticate'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

const usersRepository = new PrismaUsersRepository()
const authenticateUseCase = new AuthenticateUseCase(usersRepository)
const authenticateController = new AuthenticateController(authenticateUseCase)

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', (request, reply) =>
    authenticateController.execute(request, reply),
  )
}
