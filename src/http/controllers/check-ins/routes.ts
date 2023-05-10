import { FastifyInstance } from 'fastify'
import { CreateCheckInController } from './create'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use.case'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'
import { CheckInHistoryController } from './history'
import { GetUserMetricsController } from './metrics'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { ValidateCheckInController } from './validate'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

const checkInsController = new CreateCheckInController(makeCheckInUseCase())
const checkInHistoryController = new CheckInHistoryController(
  makeFetchUserCheckInsHistoryUseCase(),
)
const getUserMetricsController = new GetUserMetricsController(
  makeGetUserMetricsUseCase(),
)
const validateCheckInController = new ValidateCheckInController(
  makeValidateCheckInUseCase(),
)

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', (request, reply) =>
    checkInHistoryController.execute(request, reply),
  )

  app.get('/check-ins/metrics', (request, reply) =>
    getUserMetricsController.execute(request, reply),
  )

  app.post('/gyms/:gymId/check-ins', (request, reply) =>
    checkInsController.execute(request, reply),
  )

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    (request, reply) => validateCheckInController.execute(request, reply),
  )
}
