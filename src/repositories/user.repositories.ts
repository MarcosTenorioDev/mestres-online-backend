import { prisma } from "../db/prisma-client";
import {
  User,
  UserCreate,
  UserRepository,
  UserUpdate,
} from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<UserCreate> {
    try {
      return await prisma.user.create({
        data: {
          externalId: data.externalId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: "user",
        }
      });
    } catch (error) {
      throw new Error("Unable to create user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findFirst({
        where: {
          email,
        },
        include:{
          subscription:{
            select:{
              canAttachFile:true,
              canHaveManyProfiles:true,
              description:true,
              maxPostNumber:true,
              id:true
            }
          }
        }
      });
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }

  async userUpdate(data: UserUpdate): Promise<UserUpdate> {
    try {
      const result = await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role ?? null,
          phone: data.phone,
        },
        include:{
          subscription:{
            select:{
              canAttachFile:true,
              canHaveManyProfiles:true,
              description:true,
              maxPostNumber:true,
              id:true
            }
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async userUpdateByClerk(data: any): Promise<any> {
    try {
      const result = await prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      });
      return result;
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async findUserByExternalId(externalId: string): Promise<User | null> {
    try {
      return await prisma.user.findFirstOrThrow({
        where: {
          externalId,
        },
        include:{
          subscription:{
            select:{
              canAttachFile:true,
              canHaveManyProfiles:true,
              description:true,
              maxPostNumber:true,
              id:true
            }
          }
        }
      });
    } catch (error) {
      throw new Error("Failed to find user by external id.");
    }
  }
  async findUserByExternalOrId(id: string): Promise<User | null> {
    try {
      return await prisma.user.findFirstOrThrow({
        where: {
          OR: [
            {
              externalId: id,
            },
            {
              id: id,
            },
          ],
        },
        include:{
          subscription:{
            select:{
              canAttachFile:true,
              canHaveManyProfiles:true,
              description:true,
              maxPostNumber:true,
              id:true
            }
          }
        }
      });
    } catch (error) {
      throw new Error("Failed to find user by external id or id.");
    }
  }
}

export { UserRepositoryPrisma };