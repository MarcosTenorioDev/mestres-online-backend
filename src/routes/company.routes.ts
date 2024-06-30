import { FastifyInstance } from "fastify";
import { CompanyCreate } from "../interfaces/company.interface";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { CompanyUseCase } from "../usecases/company.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { jwtValidator } from "../middlewares/auth.middlewares";

const companyRepositoryPrisma = new CompanyRepositoryPrisma();
const userRepositoryPrisma = new UserRepositoryPrisma();
const companyUseCase = new CompanyUseCase(
	companyRepositoryPrisma,
	userRepositoryPrisma
);

export async function companyRoutes(fastify: FastifyInstance) {
    CreateCompanyRoute(fastify)
	GetAllCompaniesByUserId(fastify)
}

function CreateCompanyRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: CompanyCreate }>("/", async (req, reply) => {
		const { name, ownerId, description, image } = req.body;
		try {
			const data = await companyUseCase.create({ name, ownerId, description, image });
			reply.code(201).send(data);
		} catch (error) {
			reply.code(400).send(error);
		}
	});
}

function GetAllCompaniesByUserId(fastify: FastifyInstance) {
	fastify.addHook("preHandler", jwtValidator);
	fastify.get<{ Params: { externalId: string } }>("/", async (req, reply) => {
		const externalId = req.params.externalId;
		try {
			const data = await companyUseCase.getAllCompaniesByUserId(externalId);
			reply.code(201).send(data);
		} catch (error) {
			reply.code(400).send(error);
		}
	});
}
