import { FastifyInstance } from "fastify";
import { CompanyCreate } from "../interfaces/company.interface";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { CompanyUseCase } from "../usecases/company.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";

export async function companyRoutes(fastify: FastifyInstance) {
	const companyRepositoryPrisma = new CompanyRepositoryPrisma();
    const userRepositoryPrisma = new UserRepositoryPrisma();
	const companyUseCase = new CompanyUseCase(companyRepositoryPrisma, userRepositoryPrisma);

	fastify.post<{ Body: CompanyCreate }>("/", async (req, reply) => {
        const {name, ownerId} = req.body
        try {
            const data = await companyUseCase.create({name, ownerId});
            reply.code(201).send(data);
        } catch (error) {
            reply.code(400).send(error);
        }
    })
}
