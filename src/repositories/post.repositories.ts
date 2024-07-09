import { prisma } from "../db/prisma-client";
import { IPostCreate, Post, PostRepository } from "../interfaces/post.interface";

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
                topics: {
                    create: data.topicIds.map(topic => ({
                        topic: {
                            connect: { id: topic.id }
                        }
                    }))
                }
            }
        });

        return post;
    }

    async getPostById(id: string): Promise<Post> {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                topics: true, 
                author: true, 
                company: true 
            },
        });
        
        if (!post) {
            throw new Error(`Postagem não encontrada`);
        }

        return post;
    }
}

export { PostRepositoryPrisma };
