export interface Post {
    id: string;
    content: string;
    publishedAt: Date;
    authorId: string;
    companyId: string;
    imagePreview: string;
    contentPreview: string;
}

export interface IPostCreate{
    content: string;
    authorId: string;
    companyId: string;
    publishedAt?: Date;
    imagePreview: string;
    contentPreview: string;
    topicIds: {id:string}[]
}

export interface PostRepository{
    create(data:IPostCreate,externalId:string):Promise<Post>
    getPostById(id: string): Promise<Post>
}