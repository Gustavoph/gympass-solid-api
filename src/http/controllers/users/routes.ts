import { FastifyInstance } from 'fastify'

import {
  makeRegisterUseCase,
  makeAuthenticateUseCase,
} from '@/use-cases/factories'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use.case'
import { RegisterController } from './register'
import { AuthenticateController } from './authenticate'
import { ProfileController } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { RefreshController } from './refresh'

const registerController = new RegisterController(makeRegisterUseCase())
const authenticateController = new AuthenticateController(
  makeAuthenticateUseCase(),
)
const profileController = new ProfileController(makeGetUserProfileUseCase())
const refreshController = new RefreshController()

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', (request, reply) =>
    registerController.execute(request, reply),
  )

  app.post('/sessions', (request, reply) =>
    authenticateController.execute(request, reply),
  )

  app.patch('/refresh', (request, reply) =>
    refreshController.execute(request, reply),
  )

  /* Authenticated route */
  app.get('/me', { onRequest: [verifyJWT] }, (request, reply) =>
    profileController.execute(request, reply),
  )
}
