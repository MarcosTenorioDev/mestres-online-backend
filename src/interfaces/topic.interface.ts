export interface ITopicCreate{
    description:string,
    companyId:string,
}
export interface ITopic{
    id:string,
    description:string
    companyId:string
}
  

export interface TopicRepository{
    create(data: ITopicCreate): Promise<ITopic>;
    getAllTopicsByCompanyId(id:string):Promise<ITopic[] | null>
    deleteTopicById(id:string):Promise<void>
    getTopicById(id:string):Promise<ITopic | null>
    update(topic:ITopic):Promise<ITopic>
}