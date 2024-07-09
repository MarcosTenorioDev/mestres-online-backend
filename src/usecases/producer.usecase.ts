import { Producer } from "@prisma/client";
import { IProducerCreate, ProducerRepository } from "../interfaces/producer.interface";

class ProducerUseCase {
	private producerRepository: ProducerRepository;

	constructor(producerRepository: ProducerRepository) {
        this.producerRepository = producerRepository
    }

    async create(data:IProducerCreate):Promise<Producer>{
        const producer = this.producerRepository.create(data)

        return producer
    }


}

export {ProducerUseCase}
