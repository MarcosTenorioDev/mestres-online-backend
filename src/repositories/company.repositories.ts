import { PrismaClient } from '@prisma/client';
import { Company, CompanyCreate, CompanyUpdate, CompanyRepository } from '../interfaces/company.interface';

const prisma = new PrismaClient();

class CompanyRepositoryPrisma implements CompanyRepository {

    async create(data: CompanyCreate): Promise<Company> {
        try {
            const company = await prisma.company.create({
                data: {
                    name: data.name,
                    ownerId: data.ownerId,
                },
                select: {
                    id: true,
                    name: true,
                    ownerId: true,
                    posts: true,
                }
            });
            return company;
        } catch (error:any) {
            throw new Error(`Failed to create company: ${error.message}`);
        }
    }
    

    async findById(id: string): Promise<Company | null> {
        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                owner: true,
                posts: true,
                producers: true,
            }
        });
        return company;
    }

    async findByOwnerId(ownerId: string): Promise<Company | null> {
        const company = await prisma.company.findUnique({
            where: { ownerId },
            include: {
                owner: true,
                posts: true,
                producers: true,
            }
        });
        return company;
    }

    async update(data: CompanyUpdate): Promise<Company> {
        const company = await prisma.company.update({
            where: { id: data.id },
            data: {
                name: data.name,
                ownerId: data.ownerId,
            },
            include: {
                owner: true,
                posts: true,
                producers: true,
            }
        });
        return company;
    }

    async delete(id: string): Promise<void> {
        await prisma.company.delete({
            where: { id }
        });
    }
}

export { CompanyRepositoryPrisma };
