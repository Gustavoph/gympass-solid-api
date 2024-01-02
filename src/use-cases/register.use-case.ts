import { hash } from 'bcryptjs'
import { userRepository } from 'repositories/prisma/prisma-user.repository'
import { IUserRepository } from 'repositories/user.repository'
import { UserAlreadyExistsError } from 'use-cases/errors/user-already-exists-error'

interface RegisterRequest {
  name: string
  password: string
  email: string
}

export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ name, email, password }: RegisterRequest) {
    const userWithSameEmail = await this.userRepository.findByEmail(email)
    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)
    await userRepository.create({ name, email, password_hash })
  }
}
