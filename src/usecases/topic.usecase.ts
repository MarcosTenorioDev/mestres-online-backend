import { CompanyRepository } from "../interfaces/company.interface";
import { ITopicCreate, TopicRepository, ITopic } from "../interfaces/topic.interface";
import { UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { CompanyUseCase } from "./company.usecase";

class TopicUseCase {
	private topicRepository: TopicRepository;
	private companyRepository: CompanyRepository;
    private userRepository: UserRepository;

	constructor(topicRepository: TopicRepository, companyRepository: CompanyRepository, userRepository:UserRepository) {
		this.topicRepository = topicRepository;
        this.companyRepository = companyRepository
        this.userRepository= userRepository
    }

    async create(data:ITopicCreate, externalId:string){

        const user = await this.userRepository.findUserByExternalOrId(externalId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

        const company = await this.companyRepository.findById(data.companyId);

		if(user.id !== company?.ownerId){
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			)
		}

        return await this.topicRepository.create(data)
    }

	async deleteById(id:string, externalId:string){
		const user = await this.userRepository.findUserByExternalOrId(externalId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		const topic = await this.topicRepository.getTopicById(id)

		if (!topic) {
			throw new Error(
				"Tópico não encontrado"
			);
		}

		const company = await this.companyRepository.findById(topic.companyId)

		if (!company) {
			throw new Error(
				"Id da compania inválido"
			);
		}

		if(company.ownerId != user.id){
			throw new Error(
				"Operação não permitida"
			);
		}

		await this.topicRepository.deleteTopicById(id)
	}

	async update(topic:ITopic, externalId:string){
		const user = await this.userRepository.findUserByExternalId(externalId)
		const company = await this.companyRepository.findById(topic.companyId)

		if(!user || !company || company.ownerId != user.id){
			throw new Error("Operação não permitida")
		}

		const result = await this.topicRepository.update(topic)
		return result
	}
}

export {TopicUseCase}