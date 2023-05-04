import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data })
  }
}
