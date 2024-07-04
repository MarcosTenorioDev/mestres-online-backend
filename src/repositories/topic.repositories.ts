import { prisma } from "../db/prisma-client";
import {
	ITopic,
	ITopicCreate,
	TopicRepository,
} from "../interfaces/topic.interface";

class TopicRepositoryPrisma implements TopicRepository {
	async create(data: ITopicCreate): Promise<ITopic> {
		return await prisma.topic.create({
			data,
		});
	}
}

export { TopicRepositoryPrisma };
