import { Producer } from "@prisma/client";
import {
	IProducerCreate,
	ProducerRepository,
} from "../interfaces/producer.interface";
import { prisma } from "../db/prisma-client";

class ProducerRepositoryPrisma implements ProducerRepository {
	async create(data: IProducerCreate): Promise<Producer> {
		const producer = await prisma.producer.create({
			data,
		});

		return producer;
	}
}

export { ProducerRepositoryPrisma };
