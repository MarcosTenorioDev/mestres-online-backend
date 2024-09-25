export interface Post {
	id: string;
	content: string;
	publishedAt: Date;
	authorId: string;
	companyId: string;
	imagePreview: string;
	title: string;
	contentPreview: string;
}

export interface IPostCreate {
	content: string;
	authorId: string;
	companyId: string;
	publishedAt?: Date;
	imagePreview: string;
	contentPreview: string;
	title: string;
	topicIds: { topicId: string }[];
}

export interface IPostUpdate {
	id: string;
	content: string;
	authorId: string;
	companyId: string;
	imagePreview: string;
	contentPreview: string;
	title: string;
	topicIds: { topicId: string }[];
    isActive: boolean
}

export interface PostRepository {
	create(data: IPostCreate, externalId: string): Promise<Post>;
	getPostById(id: string): Promise<Post>;
	updatePost(post: IPostUpdate): Promise<Post>;
    deletePostById(id:string):Promise<void>
	validateReqIsUserPaid(userId:string, companyId:string): Promise<void>
	postCount(companyId:string): Promise<number>
}
