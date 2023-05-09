import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors'

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfile.Params): Promise<GetUserProfile.Result> {
    const user = await this.usersRepository.findById(userId)
    if (!user) throw new ResourceNotFoundError()

    return { user }
  }
}

export namespace GetUserProfile {
  export type Params = {
    userId: string
  }

  export type Result = {
    user: User
  }
}
