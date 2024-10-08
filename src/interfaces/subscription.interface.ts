export interface ISubscriptionCreate {
	userId: string | null;
	customerId: string | any;
	billingEmail: string;
	endDate: string;
	maxPostNumber: number;
	canAttachFile: boolean;
	canHaveManyProfiles: boolean;
	description: string;
}
export interface ISubscription {
	id: string;
	userId: string;
	customerId: string;
	billingEmail: string;
	startDate: string;
	endDate: string;
	maxPostNumber: number;
	canAttachFile: boolean;
	canHaveManyProfiles: boolean;
	description: string;
}

export interface ISubscriptionUpdate {
	billingEmail: string;
	customerId: string;
	canHaveManyProfiles: boolean;
	canAttachFile: boolean;
	endDate: string;
	maxPostNumber: number;
	description: string;
}

export interface SubscriptionRepository {
	create(data: ISubscriptionCreate): Promise<void>;
	revokeSubscription(id: string): Promise<void>;
	update(id: string, data: Partial<ISubscriptionUpdate>): Promise<void>;
}
