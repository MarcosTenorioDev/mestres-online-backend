import { Company, CompanyHome } from "./company.interface";
import { ITopic } from "./topic.interface";

export interface PublicCompanyHome {
	name: string;
	image: string;
	description: string;
	publicCode: string;
	banner: string;
}

export interface PublicITopic {
	id: string;
	description: string;
}

export interface PublicProducer {
	id: string;
	name: string;
	imageProfile: string | null;
	email: string;
	office: string;
}

export interface PublicIPost {
	id: string;
	publishedAt: Date;
    author: PublicProducer
	imagePreview: string;
	title: string;
	contentPreview: string;
    topics: {description:string, id:string}[]
}
export interface PublicIPostById {
	id: string;
	publishedAt: Date;
    author: PublicProducer
	imagePreview: string;
	title: string;
	contentPreview: string;
    topics: {description:string, id:string}[]
}

export interface PublicRepository {
	verifyIfCompanyIsPaid(publicCode: string): Promise<boolean>;
	findByPublicCode(publicCode: string): Promise<PublicCompanyHome | null>;
	findTopicsByPublicCode(publicCode: string): Promise<PublicITopic[]>;
    findPostsByPublicCode(publicCode: string): Promise<PublicIPost[]>
    findPostByPublicCodeAndById(postId:string):Promise<PublicIPostById | null>
    findPostsByTopicId(publicCode:string, topicId: string):Promise<PublicIPost[]>
}
