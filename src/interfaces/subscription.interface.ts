export interface ISubscriptionCreate {
    userId:string | null
    customerId:string | any
    billingEmail:string
    endDate:string
    maxPostNumber:number
    canAttachFile:boolean
    canHaveManyProfiles:boolean
}
export interface ISubscription {
    id:string
    userId:string
    customerId:string
    billingEmail:string
    startDate:string
    endDate:string
    maxPostNumber:number
    canAttachFile:boolean
    canHaveManyProfiles:boolean
}

export interface SubscriptionRepository {
	create(data: ISubscriptionCreate): Promise<void>;
    revokeSubscription(id:string):Promise<void>
}
