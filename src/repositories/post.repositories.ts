import { prisma } from "../db/prisma-client";
import {
	IPostCreate,
	IPostUpdate,
	Post,
	PostRepository,
} from "../interfaces/post.interface";

class PostRepositoryPrisma implements PostRepository {
	async create(data: IPostCreate, externalId: string): Promise<Post> {
		const post = await prisma.post.create({
			data: {
				content: data.content,
				authorId: data.authorId,
				companyId: data.companyId,
				contentPreview: data.contentPreview,
				imagePreview: data.imagePreview,
				publishedAt: data.publishedAt ?? new Date(),
				title: data.title,
				topics: {
					create: data.topicIds.map((topic) => ({
						topic: {
							connect: { id: topic.topicId },
						},
					})),
				},
			},
		});

		return post;
	}

	async getPostById(id: string): Promise<Post> {
		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				topics: {
					select: {
						topic: true,
					},
				},
				author: true,
				company: true,
			},
		});

		if (!post) {
			throw new Error(`Postagem não encontrada`);
		}

		return post;
	}

	async updatePost(data: IPostUpdate): Promise<Post> {
		const post = await prisma.post.update({
			where: { id: data.id },
			data: {
				content: data.content,
				authorId: data.authorId,
				contentPreview: data.contentPreview,
				imagePreview: data.imagePreview,
				title: data.title,
				isActive: data.isActive,
				topics: {
					deleteMany: {},
					create: data.topicIds?.map((topic) => ({
						topic: {
							connect: { id: topic.topicId },
						},
					})),
				},
			},
			include: {
				topics: {
					select: {
						topic: true,
					},
				},
				author: true,
				company: true,
			},
		});

		return post;
	}

	async deletePostById(id: string): Promise<void> {
		await prisma.post.delete({
			where: {
				id,
			},
		});
	}

	async validateReqIsUserPaid(userId: string, companyId:string): Promise<void> {
		const count = await prisma.post.count({
			where: {
				companyId
			},
		});

		const user = await prisma.user.findFirstOrThrow({
			where: {
				id: userId,
			},
		});
        
		if (!user.isPaid && count > 2) {
			throw new Error(
				"Você está no plano gratuito, só é possível criar apenas duas postagens por perfil."
			);
		}
	}
}

export { PostRepositoryPrisma };
