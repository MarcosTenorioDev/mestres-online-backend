import { FastifyInstance } from "fastify";
import { IPostCreate } from "../interfaces/post.interface";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { PostUseCase } from "../usecases/post.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { PostRepositoryPrisma } from "../repositories/post.repositories";

const userRepositoryPrisma = new UserRepositoryPrisma();
const companyRepositoryPrisma = new CompanyRepositoryPrisma();
const postRepositoryPrisma = new PostRepositoryPrisma();

const postUseCase = new PostUseCase(
	postRepositoryPrisma,
    userRepositoryPrisma,
	companyRepositoryPrisma
);
export async function postRoutes(fastify: FastifyInstance) {
	CreatePostRoute(fastify);
    getPostById(fastify)
}

function CreatePostRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: IPostCreate }>("/", {
		preHandler: [jwtValidator],
		handler: async (req: any, reply: any) => {
			const { content, authorId, companyId, topicIds, contentPreview, imagePreview } = req.body;
			const externalId = req.params.externalId;
			try {
				const data = await postUseCase.create(
					{ content, authorId, companyId, topicIds, contentPreview, imagePreview },
					externalId
				);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function getPostById(fastify:FastifyInstance){
    fastify.get('/:id', {
        preHandler:[jwtValidator],
        handler: async (req:any, res:any) => {
            const externalId = req.params.externalId;
            const id = req.params.id;
            try{
                const data = await postUseCase.getPostById(id, externalId)
                res.code(200).send(data);

            }catch(err){
				res.code(400).send(err);
            }
        }
    })
}