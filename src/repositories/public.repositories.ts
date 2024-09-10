import { prisma } from "../db/prisma-client";
import { Company, CompanyHome } from "../interfaces/company.interface";
import {
	PublicCompanyHome,
	PublicIPost,
	PublicIPostById,
	PublicITopic,
	PublicRepository,
} from "../interfaces/public.interface";

class PublicRepositoryPrisma implements PublicRepository {

	async findByPublicCode(
		publicCode: string
	): Promise<PublicCompanyHome | null> {
		const company = await prisma.company.findUniqueOrThrow({
			where: {
				publicCode,
			},
			select: {
				name: true,
				image: true,
				description: true,
				publicCode: true,
				banner: true,
			},
		});

		return company;
	}

	async findTopicsByPublicCode(publicCode: string): Promise<PublicITopic[]> {
		const topics = await prisma.company.findUniqueOrThrow({
			where: {
				publicCode,
			},
			select: {
				topics: {
					select: {
						id: true,
						description: true,
						posts: {
							select: {
								post:{
									select:{
										isActive:true
									}
								}
							},
							take: 1, // Para garantir que apenas tópicos com pelo menos um post sejam retornados
						},
					},
					// Filtra tópicos que têm pelo menos um post
					where: {
						posts: {
							some: {
								post:{
									isActive:true
								}
							},
							 // 'some' garante que a consulta retorna apenas tópicos com pelo menos um post
						},
					},
				},
			},
		});

		return topics.topics;
	}

	async findPostsByPublicCode(publicCode: string): Promise<PublicIPost[]> {
		const company = await prisma.company.findUnique({
			where: {
				publicCode,
			},
			select: {
				id: true,
			},
		});

		const posts = await prisma.post.findMany({
			where: {
				companyId: company?.id,
				isActive: true,
			},
			select: {
				id: true,
				contentPreview: true,
				imagePreview: true,
				publishedAt: true,
				title: true,
				author: {
					select: {
						imageProfile: true,
						name: true,
						office: true,
					},
				},
				topics: {
					select: {
						topic: {
							select: {
								description: true,
								id: true,
							},
						},
					},
				},
			},
		});

		const formattedPosts = posts.map((post) => ({
			...post,
			topics: post.topics.map((topicWrapper) => ({
				description: topicWrapper.topic.description,
				id: topicWrapper.topic.id,
			})),
		}));

		return formattedPosts;
	}

	async findPostByPublicCodeAndById(
		postId: string
	): Promise<PublicIPostById | null> {
		const post = await prisma.post.findUniqueOrThrow({
			where: {
				id: postId,
				isActive: true,
			},
			select: {
				id: true,
				content: true,
				contentPreview: true,
				imagePreview: true,
				publishedAt: true,
				title: true,
				author: {
					select: {
						email: true,
						id: true,
						imageProfile: true,
						name: true,
						office: true,
					},
				},
				topics: {
					select: {
						topic: {
							select: {
								description: true,
								id: true,
							},
						},
					},
				},
			},
		});

		const { topics, ...rest } = post;

		const formattedPost = {
			...rest,
			topics: post.topics.map((topicWrapper) => ({
				description: topicWrapper.topic.description,
				id: topicWrapper.topic.id,
			})),
		};

		return formattedPost;
	}

	async findPostsByTopicId(
		publicCode: string,
		topicId: string
	): Promise<PublicIPost[]> {
		const company = await prisma.company.findUnique({
			where: {
				publicCode,
			},
			select: {
				id: true,
			},
		});

		const posts = await prisma.post.findMany({
			where: {
				topics: {
					some: {
						topicId,
					},
				},
				companyId: company?.id,
			},
            select: {
				id: true,
				contentPreview: true,
				imagePreview: true,
				publishedAt: true,
				title: true,
				author: {
					select: {
						email: true,
						id: true,
						imageProfile: true,
						name: true,
						office: true,
					},
				},
				topics: {
					select: {
						topic: {
							select: {
								description: true,
								id: true,
							},
						},
					},
				},
			},
		});

        const formattedPosts = posts.map((post) => ({
			...post,
			topics: post.topics.map((topicWrapper) => ({
				description: topicWrapper.topic.description,
				id: topicWrapper.topic.id,
			})),
		}));

        return formattedPosts
	}
}

export { PublicRepositoryPrisma };
