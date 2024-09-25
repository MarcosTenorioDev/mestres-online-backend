import { Producer } from "@prisma/client";
import {
	Company,
	CompanyCreate,
	CompanyHome,
	CompanyRepository,
	CompanySearch,
	CompanyUpdate,
} from "../interfaces/company.interface";
import { ITopic, TopicRepository } from "../interfaces/topic.interface";
import { UserRepository } from "../interfaces/user.interface";
import { IProducerCompany } from "../interfaces/producer.interface";

class CompanyUseCase {
	private companyRepository: CompanyRepository;
	private userRepository: UserRepository;
	private topicRepository: TopicRepository;

	constructor(
		companyRepository: CompanyRepository,
		userRepository: UserRepository,
		topicRepository: TopicRepository
	) {
		this.companyRepository = companyRepository;
		this.userRepository = userRepository;
		this.topicRepository = topicRepository;
	}

	async create({
		name,
		ownerId,
		description,
		image,
		banner,
	}: CompanyCreate): Promise<Company> {
		const user = await this.userRepository.findUserByExternalOrId(ownerId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}
		if(!user.subscription?.canHaveManyProfiles){
			throw new Error(
				"Operação não permitida"
			);
		}
		return this.companyRepository.create({
			name,
			ownerId: user.id,
			image,
			description,
			banner,
		});
	}

	async getAllCompaniesByUserId(
		externalId: string
	): Promise<CompanyHome[] | []> {
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		return this.companyRepository.getAllCompaniesByUserId(user.id);
	}

	async getCompanyById(
		id: string,
		externalId: string
	): Promise<Company | null> {
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contate o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(id);

		if (!company) {
			throw new Error("Companhia não encontrada");
		}

		if (user.id !== company?.ownerId) {
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			);
		}

		return company;
	}

	async getAllTopicsByCompanyId(
		externalId: string,
		id: string
	): Promise<ITopic[] | null> {
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contate o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(id);

		if (!company) {
			throw new Error("Companhia não encontrada");
		}

		if (user.id !== company?.ownerId) {
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			);
		}

		const topics: ITopic[] | null =
			await this.topicRepository.getAllTopicsByCompanyId(id);

		return topics;
	}

	async getAllProducersByCompanyId(
		id: string,
		externalId: string
	): Promise<IProducerCompany[] | null> {
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contate o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(id);

		if (!company) {
			throw new Error("Companhia não encontrada");
		}

		if (user.id !== company?.ownerId) {
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			);
		}

		const producers: IProducerCompany[] | null =
			await this.companyRepository.getAllProducersByCompanyId(id);

		return producers;
	}

	async update(data: CompanyUpdate, externalId: string) {
		const user = await this.userRepository.findUserByExternalId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor, contatar o suporte técnico"
			);
		}

		if (user.id != data.ownerId) {
			throw new Error("Operação não permitida");
		}

		const company = await this.companyRepository.update(data);

		return company;
	}

	async updatePublicCode(
		data: { companyId: string; publicCode: string },
		externalId: string
	) {
		const user = await this.userRepository.findUserByExternalId(externalId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor, contatar o suporte técnico"
			);
		}
		if(!user.subscriptionId){
			throw new Error(
				"Operação não permitida"
			);
		}

		const company = await this.companyRepository.findById(data.companyId);

		if (!company) {
			throw new Error(
				"Perfil não encontrado, por favor, contatar o suporte técnico"
			);
		}

		if (!user.isPaid) {
			throw new Error(
				"Seu perfil não aderiu a um pacote de plano de API, por favor, verifique os planos na nossa sessão de planos"
			);
		}

		if (company.ownerId != user.id) {
			throw new Error("Operação não permitida");
		}

		const result = await this.companyRepository.updatePublicCode({
			id: company.id,
			publicCode: data.publicCode,
		});
		return result;
	}

	async verifyIfPublicCodeIsValid(publicCode:string):Promise<boolean>{
		return await this.companyRepository.verifyIfPublicCodeIsValid(publicCode)
	}

	async delete(externalId:string, companyId:string):Promise<void>{
		const user = await this.userRepository.findUserByExternalId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor, contatar o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(companyId);

		if (!company) {
			throw new Error("Companhia não encontrada");
		}

		if (user.id !== company?.ownerId) {
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			);
		}

		return await this.companyRepository.delete(company.id)

	}

	async getCompanyByName(name:string):Promise<CompanySearch[]>{
		return await this.companyRepository.getCompanyByName(name)
	}
}

export { CompanyUseCase };
