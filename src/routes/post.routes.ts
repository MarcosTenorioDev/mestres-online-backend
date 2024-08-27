import { FastifyInstance } from "fastify";
import { IPostCreate } from "../interfaces/post.interface";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { PostUseCase } from "../usecases/post.usecase";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { PostRepositoryPrisma } from "../repositories/post.repositories";
import multer from "fastify-multer";
import { UserUseCase } from "../usecases/user.usecase";
import fastifyMultipart from "fastify-multipart";
import fs from "fs";

const userRepositoryPrisma = new UserRepositoryPrisma();
const companyRepositoryPrisma = new CompanyRepositoryPrisma();
const postRepositoryPrisma = new PostRepositoryPrisma();
const upload = multer({ dest: "tmp/" });

const postUseCase = new PostUseCase(
	postRepositoryPrisma,
	userRepositoryPrisma,
	companyRepositoryPrisma
);
const userUseCase = new UserUseCase(userRepositoryPrisma);
export async function postRoutes(fastify: FastifyInstance) {
	fastify.register(fastifyMultipart);
	CreatePostRoute(fastify);
	getPostById(fastify);
	UploadFile(fastify);
	updatePost(fastify);
	deletePostById(fastify)
	getMyPostsCount(fastify)
}

function CreatePostRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: IPostCreate }>("/", {
		preHandler: [jwtValidator],
		handler: async (req: any, reply: any) => {
			const {
				content,
				authorId,
				companyId,
				topicIds,
				contentPreview,
				imagePreview,
				title,
			} = req.body;
			const externalId = req.params.externalId;
			try {
				const data = await postUseCase.create(
					{
						content,
						authorId,
						companyId,
						topicIds,
						contentPreview,
						imagePreview,
						title,
					},
					externalId
				);
				reply.code(201).send(data);
			} catch (error) {
				reply.code(400).send(error);
			}
		},
	});
}

function getPostById(fastify: FastifyInstance) {
	fastify.get("/:id", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const externalId = req.params.externalId;
			const id = req.params.id;
			try {
				const data = await postUseCase.getPostById(id, externalId);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function getMyPostsCount(fastify: FastifyInstance) {
	fastify.get("/count/:companyId", {
		preHandler: [jwtValidator],
		handler: async (req: any, res: any) => {
			const companyId = req.params.companyId;
			try {
				const data =  await postRepositoryPrisma.postCount(companyId)
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(err);
			}
		},
	});
}

function UploadFile(fastify: FastifyInstance) {
	fastify.post("/upload", {
		preHandler: [jwtValidator, upload.single("file")],
		handler: async (req: any, res: any) => {
			try {
				const externalId = req.params.externalId;
				const file = req.file;
				if (!file) {
					res.code(400).send("Houve um erro ao fazer o upload do seu arquivo");
					return;
				}

				const user = await userUseCase.findUserByExternalOrId(externalId);

				if (!user) {
					res.code(403).send("Operação não permitida");
					return;
				}
				const url = await postUseCase.uploadFile(file.path, file.mimetype.replace("/","."));
				res.code(201).send({ url: url });
			} catch (error: any) {
				res.code(400).send({ error: error.message });
			}
		},
	});
}

function updatePost(fastify: FastifyInstance) {
	fastify.put(
		"/",
		{ preHandler: [jwtValidator] },
		async (req: any, res: any) => {
			const {
				id,
				imagePreview,
				contentPreview,
				authorId,
				topicIds,
				companyId,
				title,
				content,
				isActive,
			} = req.body;
			const externalId = req.params.externalId;
			try {
				const data = await postUseCase.updatePost(
					{
						id,
						imagePreview,
						contentPreview,
						authorId,
						topicIds,
						companyId,
						title,
						content,
						isActive,
					},
					externalId
				);
				res.code(200).send(data);
			} catch (err) {
				res.code(400).send(`${err}`);
			}
		}
	);
}

function deletePostById(fastify: FastifyInstance) {
	fastify.delete(
		"/:id",
		{ preHandler: [jwtValidator] },
		async (req: any, res: any) => {
			const { id, externalId } = req.params;
			try {
				await postUseCase.deletePostById(id, externalId);
				res.code(200).send();
			} catch (err) {
				res.code(400).send(`${err}`);
			}
		}
	);
}
