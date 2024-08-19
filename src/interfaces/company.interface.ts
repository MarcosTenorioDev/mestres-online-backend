import { Post } from "./post.interface";
import { IProducerCompany, Producer } from "./producer.interface";
import { User } from "./user.interface";

export interface Company {
	id: string;
	name: string;
	description: string;
	image: string;
	banner: string;
	ownerId: string;
	owner?: User;
	posts: Post[];
	producers?: Producer[];
}

export interface CompanyHome {
	id: string;
	name: string;
	description: string;
	banner: string;
	image: string;
	ownerId: string;
}

export interface CompanyCreate {
	name: string;
	ownerId: string;
	banner: string;
	image: string;
	description: string;
}

export interface CompanyUpdate {
	id: string;
	name: string;
	description: string;
	banner: string;
	image: string;
	ownerId: string;
}

export interface CompanyRepository {
	create(data: CompanyCreate): Promise<Company>;
	findById(id: string): Promise<Company | null>;
	getAllCompaniesByUserId(
		externalId: string
	): Promise<
		| {
				id: string;
				name: string;
				ownerId: string;
				description: string;
				image: string;
				banner: string;
		  }[]
		| []
	>;
	update(data: CompanyUpdate): Promise<Company>;
	delete(id: string): Promise<void>;
	getAllProducersByCompanyId(id: string): Promise<IProducerCompany[] | null>;
	updatePublicCode(data: { id: string; publicCode: string }): Promise<Company>;
    verifyIfPublicCodeIsValid(publicCode:string):Promise<boolean>
}
