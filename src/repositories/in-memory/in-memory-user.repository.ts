import { Prisma, User } from '@prisma/client'
import { IUserRepository } from 'repositories/user.repository'

export class InMemoryUserRepository implements IUserRepository {
  public users: any[] = []

  async create(data: Prisma.UserCreateInput): Promise<void> {
    this.users.push(data)
  }

  async findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.')
  }
}
