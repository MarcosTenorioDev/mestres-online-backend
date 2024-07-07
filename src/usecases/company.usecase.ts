import {
	Company,
	CompanyCreate,
	CompanyHome,
	CompanyRepository,
} from "../interfaces/company.interface";
import { UserRepository } from "../interfaces/user.interface";

class CompanyUseCase {
	private companyRepository: CompanyRepository;
	private userRepository: UserRepository;

	constructor(companyRepository: CompanyRepository, userRepository:UserRepository) {
		this.companyRepository = companyRepository;
        this.userRepository = userRepository
	}

	async create({ name, ownerId, description, image }: CompanyCreate): Promise<Company> {
		const user = await this.userRepository.findUserByExternalOrId(ownerId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		return this.companyRepository.create({
			name,
			ownerId:user.id,
			image,
			description
		});
	}

	async getAllCompaniesByUserId(externalId: string): Promise<CompanyHome[] | []>{
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		return this.companyRepository.getAllCompaniesByUserId(user.id)
	}

	async getCompanyById(id:string, externalId:string):Promise<Company | null>{
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contate o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(id);

		if(user.id !== company?.ownerId){
			throw new Error(
				"Operação não permitida, por favor contate o suporte técnico"
			)
		}

		return company

	}
}

export { CompanyUseCase };
