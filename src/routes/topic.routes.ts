import { FastifyInstance } from "fastify";
import { ITopicCreate } from "../interfaces/topic.interface";
import { TopicUseCase } from "../usecases/topic.usecase";
import { TopicRepositoryPrisma } from "../repositories/topic.repositories";
import { CompanyUseCase } from "../usecases/company.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { jwtValidator } from "../middlewares/auth.middlewares";

const topicRepository = new TopicRepositoryPrisma();
const userRepository = new UserRepositoryPrisma();
const companyRepository = new CompanyRepositoryPrisma();
const topicUseCase = new TopicUseCase(
	topicRepository,
	companyRepository,
	userRepository
);

export async function topicRoutes(fastify: FastifyInstance) {
	CreateTopipcRoute(fastify);
	DeleteTopicByIdRoute(fastify)
}

function CreateTopipcRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: ITopicCreate }>("/", {
		preHandler: [jwtValidator],
		handler: async (req: any, reply: any) => {
			const { description, companyId } = req.body;
			const externalId = req.params.externalId;
			try {
				const data = await topicUseCase.create(
					{ description, companyId },
					externalId
				);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function DeleteTopicByIdRoute(fastify: FastifyInstance) {
	fastify.delete(
		"/:id",
		{
			preHandler: [jwtValidator],
		},
		async (req: any, res: any) => {
			const {id, externalId} = req.params
			try{
				await topicUseCase.deleteById(id, externalId)
				res.code(204).send()
			}catch(err){
				res.code(400).send(`${err}`)
			}
		}
	);
}
