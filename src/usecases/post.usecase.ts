import { randomUUID } from "crypto";
import { CompanyRepository } from "../interfaces/company.interface";
import {
	IPostCreate,
	Post,
	PostRepository,
} from "../interfaces/post.interface";
import { UserRepository } from "../interfaces/user.interface";
import S3Storage from "../utils/s3.utils";
import fs from "fs";

class PostUseCase {
	private postRepository: PostRepository;
	private userRepository: UserRepository;
	private companyRepository: CompanyRepository;
	private s3 = new S3Storage();

	constructor(
		postRepository: PostRepository,
		userRepository: UserRepository,
		companyRepository: CompanyRepository
	) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.companyRepository = companyRepository;
	}

	async create(data: IPostCreate, externalId: string): Promise<Post> {
		const user = await this.userRepository.findUserByExternalOrId(externalId);
		/*Verificar validade do token e se o usuário dele existe  */
		if (!user) {
			throw new Error(
				"Usuário não encontrado, por favor contatar o suporte técnico"
			);
		}

		const company = await this.companyRepository.findById(data.companyId);
		/*Verificar se a company registrada existe  */
		if (!company) {
			throw new Error(
				"Id da compania não encontrado, por favor, contate o suporte técnico"
			);
		}
		/*Verificar se o usuário é o dono da company  */
		if (user.id != company.ownerId) {
			throw new Error("Apenas o dono da compania pode criar uma postagem");
		}

		const post = this.postRepository.create(data, externalId);

		return post;
	}

	async getPostById(id: string, externalId: string): Promise<Post> {
		const post = await this.postRepository.getPostById(id);
		return post;
	}

	async uploadFile(filePath: any, fileType: string): Promise<string> {
		const file = fs.readFileSync(filePath);

		// Upload file to s3
		const result = await this.s3.uploadFile(
			`asset-${new Date().toISOString()}.${randomUUID()}.${fileType}`,
			file
		);

		if (!result) {
			fs.unlinkSync(filePath);
			throw new Error(
				"Houve um erro ao processar sua requisição, por favor, contate o suporte técnico"
			);
		}
        fs.unlinkSync(filePath);

		const url = `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
		return url;
	}
}

export { PostUseCase };
