export interface Producer {
    id: string
    name: string
    imageProfile:string
    email:string
    office: string
    companyId: string
}

export interface IProducerCreate {
    name: string;
    imageProfile: string;
    email: string;
    office: string;
    companyId: string;
}


export interface ProducerRepository{
    create(data:IProducerCreate):Promise<Producer>;
}