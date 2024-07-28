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

	async getAllTopicsByCompanyId(id:string):Promise<ITopic[] | null>{
		return await prisma.topic.findMany(({
			where: {
				companyId:id
			}
		}))
	}

	async deleteTopicById(id:string):Promise<void>{
		await prisma.topic.delete(({
			where: {
				id
			}
		}))
	}	

	async getTopicById(id:string):Promise<ITopic | null>{
		return await prisma.topic.findUnique(({
			where: {
				id
			}
		}))
	}
}

export { TopicRepositoryPrisma };
