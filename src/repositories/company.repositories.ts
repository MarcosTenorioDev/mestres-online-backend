import { PrismaClient } from '@prisma/client';
import { Company, CompanyCreate, CompanyUpdate, CompanyRepository, CompanyHome } from '../interfaces/company.interface';
import { Producer } from '../interfaces/producer.interface';

const prisma = new PrismaClient();

class CompanyRepositoryPrisma implements CompanyRepository {

    async create(data: CompanyCreate): Promise<Company> {
        try {
            const company = await prisma.company.create({
                data: {
                    name: data.name,
                    description: data.description,
                    ownerId: data.ownerId,
                    image: data.image
                },
                select: {
                    id: true,
                    description:true,
                    image:true,
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

    async update(data: CompanyUpdate): Promise<Company> {
        const company = await prisma.company.update({
            where: { id: data.id },
            data: {
                name: data.name,
                ownerId: data.ownerId,
                description: data.description
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

    async getAllCompaniesByUserId(externalId: string): Promise<CompanyHome[] | []> {
        const companies: CompanyHome[] | [] = await prisma.company.findMany({
            where: {ownerId : externalId}
        })

        return companies
    }

    async getAllProducersByCompanyId(id: string): Promise<Producer[] | null> {
        const producers: Producer[] | null = await prisma.producer.findMany({
            where:{
                companyId: id
            }
        })
        return producers
    }
}

export { CompanyRepositoryPrisma };
