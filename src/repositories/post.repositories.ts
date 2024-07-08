import { prisma } from "../db/prisma-client";
import { IPostCreate, Post, PostRepository } from "../interfaces/post.interface";

class PostRepositoryPrisma implements PostRepository {

    async create(data: IPostCreate, externalId: string): Promise<Post> {
        const post = await prisma.post.create({
            data: {
                content: data.content,
                authorId: data.authorId,
                companyId: data.companyId,
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
}

export { PostRepositoryPrisma };
