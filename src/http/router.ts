import { FastifyInstance } from 'fastify'
import { RegisterController } from './controllers/register'
import { AuthenticateController } from './controllers/authenticate'

import {
  makeRegisterUseCase,
  makeAuthenticateUseCase,
} from '@/use-cases/factories'

const registerController = new RegisterController(makeRegisterUseCase())
const authenticateController = new AuthenticateController(
  makeAuthenticateUseCase(),
)

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) =>
    registerController.execute(request, reply),
  )

  app.post('/sessions', (request, reply) =>
    authenticateController.execute(request, reply),
  )
}
