import { FastifyInstance } from 'fastify'
import { RegisterController } from './controllers/register'
import { AuthenticateController } from './controllers/authenticate'

import {
  makeRegisterUseCase,
  makeAuthenticateUseCase,
} from '@/use-cases/factories'
import { ProfileController } from './controllers/profile'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use.case'
import { verifyJWT } from './middlewares/verify-jwt'

const registerController = new RegisterController(makeRegisterUseCase())
const authenticateController = new AuthenticateController(
  makeAuthenticateUseCase(),
)
const profileController = new ProfileController(makeGetUserProfileUseCase())

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) =>
    registerController.execute(request, reply),
  )

  app.post('/sessions', (request, reply) =>
    authenticateController.execute(request, reply),
  )

  app.get('/me', { onRequest: [verifyJWT] }, (request, reply) =>
    profileController.execute(request, reply),
  )
}
