import fastify, { FastifyInstance } from "fastify";
import { PublicUseCase } from "../usecases/public.usecase";

const publicUseCase = new PublicUseCase()
export async function publicRoutes(fastify: FastifyInstance) {
    getCompanyByPublicCode(fastify)
    getCompanyTopicsByPublicCode(fastify)
    getCompanyPostsByPublicCode(fastify)
    getPublicPostById(fastify)
    getPublicPostByTopicId(fastify)
}

function getCompanyByPublicCode(fastify: FastifyInstance) {
	fastify.get("/:publicCode", {
		handler: async (req: any, res: any) => {
            const{ publicCode }= req.params
			try {
				const data = await publicUseCase.getCompanyByPublicCode(publicCode);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getCompanyTopicsByPublicCode(fastify: FastifyInstance) {
	fastify.get("/topics/:publicCode", {
		handler: async (req: any, res: any) => {
            const{ publicCode }= req.params
			try {
				const data = await publicUseCase.getTopicByPublicCode(publicCode);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getCompanyPostsByPublicCode(fastify: FastifyInstance) {
	fastify.get("/posts/:publicCode", {
		handler: async (req: any, res: any) => {
            const{ publicCode }= req.params
			try {
				const data = await publicUseCase.getPostsByPublicCode(publicCode);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getPublicPostById(fastify:FastifyInstance){
    fastify.get("/:publicCode/post/:postId", {
		handler: async (req: any, res: any) => {
            const{ publicCode, postId }= req.params
			try {
				const data = await publicUseCase.getUniquePostByPublicCodeAndPostId({ publicCode, postId });
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getPublicPostByTopicId(fastify:FastifyInstance){
    fastify.get("/:publicCode/posts/topic/:topicId", {
		handler: async (req: any, res: any) => {
            const{ publicCode, topicId }= req.params
			try {
				const data = await publicUseCase.getPublicPostsByTopicId({ publicCode, topicId });
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}