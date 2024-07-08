export interface Post {
    id: string;
    content: string;
    publishedAt: Date;
    authorId: string;
    companyId: string;
}

export interface IPostCreate{
    content: string;
    authorId: string;
    companyId: string;
    publishedAt?: Date;
    topicIds: {id:string}[]
}

export interface PostRepository{
    create(data:IPostCreate,externalId:string):Promise<Post>
}