import {
	IProducerCreate,
	Producer,
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

	async update(producer: Producer): Promise<Producer> {
		try{
			return await prisma.producer.update({
				where:{
					id: producer.id
				},data:{
					imageProfile: producer.imageProfile,
					email: producer.email,
					name: producer.name,
					office: producer.name
				}
			})
		}catch(err){
			throw new Error(`Erro ao editar o autor, ${err}`)
		}
	}
}

export { ProducerRepositoryPrisma };
