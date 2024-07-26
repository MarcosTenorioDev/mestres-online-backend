import { Producer } from "@prisma/client";
import {
	IProducerCreate,
	ProducerRepository,
} from "../interfaces/producer.interface";
import { CompanyRepository } from "../interfaces/company.interface";
import { UserRepository } from "../interfaces/user.interface";

class ProducerUseCase {
	private producerRepository: ProducerRepository;
	private companyRepository: CompanyRepository;
	private userRepository: UserRepository;

	constructor(
		producerRepository: ProducerRepository,
		companyRepository: CompanyRepository,
		userRepository: UserRepository
	) {
		this.producerRepository = producerRepository;
		this.companyRepository = companyRepository;
		this.userRepository = userRepository;
	}

	async create(data: IProducerCreate): Promise<Producer> {
		const producer = this.producerRepository.create(data);

		return producer;
	}

	async delete(id: string, externalId: string): Promise<void> {
		const producer: Producer | null = await this.producerRepository.findById(
			id
		);

		if (!producer) {
			throw new Error("Autor não encontrado");
		}

		const user = await this.userRepository.findUserByExternalId(externalId);

		if (!user) {
			throw new Error("Operação não permitida");
		}

		const company = await this.companyRepository.findById(producer.companyId);

		if (!company) {
			throw new Error("Operação não permitida");
		}
		if (company.ownerId != user.id) {
			throw new Error("Operação não permitida");
		}

		return await this.producerRepository.delete(id);
	}
}

export { ProducerUseCase };
