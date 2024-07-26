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

	async delete(id:string):Promise<void>{
		try{
			await prisma.producer.delete({
				where:{
					id
				}
			})
		}catch(err){
			throw new Error(`Erro ao excluir o autor, ${err}`)
		}
	}

	async findById(id:string):Promise<Producer | null>{
		try{
			return await prisma.producer.findFirst({
				where:{
					id
				}
			})
		}catch(err){
			throw new Error(`Erro ao buscar o autor, ${err}`)
		}
	}
}

export { ProducerRepositoryPrisma };
