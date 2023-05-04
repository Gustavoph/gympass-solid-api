import { User, Prisma } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: 'user-id',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
