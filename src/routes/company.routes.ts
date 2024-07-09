import { FastifyInstance } from "fastify";
import { CompanyCreate } from "../interfaces/company.interface";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { CompanyUseCase } from "../usecases/company.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { TopicUseCase } from "../usecases/topic.usecase";
import { TopicRepositoryPrisma } from "../repositories/topic.repositories";

const companyRepositoryPrisma = new CompanyRepositoryPrisma();
const userRepositoryPrisma = new UserRepositoryPrisma();
const topicRepositoryPrisma = new TopicRepositoryPrisma()
const companyUseCase = new CompanyUseCase(
	companyRepositoryPrisma,
	userRepositoryPrisma,
	topicRepositoryPrisma
);

export async function companyRoutes(fastify: FastifyInstance) {
	CreateCompanyRoute(fastify);
	GetAllCompaniesByUserId(fastify);
	GetCompanyById(fastify)
	GetAllTopicsByCompanyId(fastify)
}

function CreateCompanyRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: CompanyCreate, Params: { externalId: string } }>("/", {
		preHandler: jwtValidator, 
		handler: async (req, reply) => {
		const { name, description, image } = req.body;
		const externalId = req.params.externalId;
		try {
			const data = await companyUseCase.create({
				name,
				ownerId:externalId,
				description,
				image,
			});
			reply.code(201).send(data);
		} catch (error) {
			reply.code(400).send(error);
		}
	},
});
}

function GetAllCompaniesByUserId(fastify: FastifyInstance) {
	fastify.get<{ Params: { externalId: string } }>("/", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const externalId = req.params.externalId;
			try {
				const data = await companyUseCase.getAllCompaniesByUserId(externalId);
				reply.code(200).send(data);
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
				reply.code(200).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function GetAllTopicsByCompanyId(fastify: FastifyInstance){
	fastify.get('/topics/:id', {
		preHandler:[jwtValidator],
		handler: async(req:any, res:any) => {
			const externalId = req.params.externalId
			const id = req.params.id;
			try{
				const data = await companyUseCase.getAllTopicsByCompanyId(externalId, id)
				return res.code(200).send(data)
			}catch(err){
				res.code(400).send(err);
			}
		}
	})
}
