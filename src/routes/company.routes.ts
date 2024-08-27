import { FastifyInstance } from "fastify";
import { CompanyCreate, CompanyUpdate } from "../interfaces/company.interface";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { CompanyUseCase } from "../usecases/company.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { TopicUseCase } from "../usecases/topic.usecase";
import { TopicRepositoryPrisma } from "../repositories/topic.repositories";

const companyRepositoryPrisma = new CompanyRepositoryPrisma();
const userRepositoryPrisma = new UserRepositoryPrisma();
const topicRepositoryPrisma = new TopicRepositoryPrisma();
const companyUseCase = new CompanyUseCase(
	companyRepositoryPrisma,
	userRepositoryPrisma,
	topicRepositoryPrisma
);

export async function companyRoutes(fastify: FastifyInstance) {
	CreateCompanyRoute(fastify);
	GetAllCompaniesByUserId(fastify);
	GetCompanyById(fastify);
	GetAllTopicsByCompanyId(fastify);
	getAllProducersByCompanyId(fastify);
	updateCompany(fastify);
	updatePublicCode(fastify)
	isValidPublicCode(fastify)
	deleteCompany(fastify)
}

function CreateCompanyRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: CompanyCreate; Params: { externalId: string } }>("/", {
		preHandler: jwtValidator,
		handler: async (req, reply) => {
			const { name, description, image, banner } = req.body;
			const externalId = req.params.externalId;
			try {
				const data = await companyUseCase.create({
					name,
					ownerId: externalId,
					description,
					image,
					banner,
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
	fastify.get<{ Params: { id: string; externalId: string } }>("/:id", {
		preHandler: [jwtValidator],
		handler: async (req, reply) => {
			const { id } = req.params;
			const externalId = req.params.externalId;
			try {
				const data = await companyUseCase.getCompanyById(id, externalId);
				reply.code(200).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function GetAllTopicsByCompanyId(fastify: FastifyInstance) {
	fastify.get("/topics/:id", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const externalId = req.params.externalId;
			const id = req.params.id;
			try {
				const data = await companyUseCase.getAllTopicsByCompanyId(
					externalId,
					id
				);
				return res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getAllProducersByCompanyId(fastify: FastifyInstance) {
	fastify.get("/producers/:id", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const externalId = req.params.externalId;
			const id = req.params.id;
			try {
				const data = await companyUseCase.getAllProducersByCompanyId(
					id,
					externalId
				);
				return res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function updateCompany(fastify: FastifyInstance) {
	fastify.put("/", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const { banner, description, id, image, name, ownerId }: CompanyUpdate =
				req.body;
			const { externalId } = req.params;
			try {
				const data = companyUseCase.update(
					{ banner, description, id, image, name, ownerId },
					externalId
				);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function updatePublicCode(fastify: FastifyInstance) {
	fastify.put("/publicCode", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const {publicCode, companyId} = req.body
			const {externalId} = req.params
			try{
				const data = await companyUseCase.updatePublicCode({publicCode, companyId}, externalId)
				res.code(200).send(data)
			}catch(err){
				res.code(400).send(err)
			}
		},
	});
}

function isValidPublicCode(fastify:FastifyInstance){
	fastify.get("/publicCode/isValid/:publicCode", {preHandler:[jwtValidator], handler: async (req:any,res:any) => {
		const {publicCode} = req.params
			try{
				const data = await companyUseCase.verifyIfPublicCodeIsValid(publicCode)
				res.code(200).send(data)
			}catch(err){
				res.code(400).send(err)
			}
	}})
}

function deleteCompany(fastify:FastifyInstance){
	fastify.delete("/:id", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const { id } = req.params;
			const externalId = req.params.externalId;
			try {
				const data = companyUseCase.delete(externalId, id)
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}
