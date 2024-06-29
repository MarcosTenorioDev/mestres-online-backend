import { Company } from "@prisma/client";
import {
	CompanyCreate,
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

	async create({ name, ownerId }: CompanyCreate): Promise<Company> {
		const user = await this.userRepository.findUserByExternalOrId(ownerId);

		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		return this.companyRepository.create({
			name,
			ownerId,
		});
	}
}

export { CompanyUseCase };
