export interface ITopicCreate{
    description:string,
    companyId:string,
}
export interface ITopic{
    id:string,
    description:string
}
  

export interface TopicRepository{
    create(data: ITopicCreate): Promise<ITopic>;
    getAllTopicsByCompanyId(id:string):Promise<ITopic[] | null>
}