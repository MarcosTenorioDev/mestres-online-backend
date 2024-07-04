export interface ITopicCreate{
    description:string,
    companyId:string,
}
export interface ITopic{
    id:string,
    description:string,
    companyId:string,
}
  

export interface TopicRepository{
    create(data: ITopicCreate): Promise<ITopic>;
}