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
	CreateCompanyRoute(fastify);
	GetAllCompaniesByUserId(fastify);
	GetCompanyById(fastify)
}

function CreateCompanyRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: CompanyCreate }>("/", async (req, reply) => {
		const { name, ownerId, description, image } = req.body;
		try {
			const data = await companyUseCase.create({
				name,
				ownerId,
				description,
				image,
			});
			reply.code(201).send(data);
		} catch (error) {
			reply.code(400).send(error);
		}
	});
}

function GetAllCompaniesByUserId(fastify: FastifyInstance) {
	fastify.get<{ Params: { externalId: string } }>("/", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const externalId = req.params.externalId;
			try {
				const data = await companyUseCase.getAllCompaniesByUserId(externalId);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function GetCompanyById(fastify: FastifyInstance) {
	fastify.get<{ Params: { id: string , externalId:string} }>("/:id", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const { id } = req.params;
			const externalId = req.params.externalId;
			try {
				const data = await companyUseCase.getCompanyById(id,externalId);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}
