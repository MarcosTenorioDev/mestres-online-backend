export interface Producer {
	id: string;
	name: string;
	imageProfile: string | null;
	email: string;
	office: string;
	companyId: string;
}

export interface IProducerCompany {
	id: string;
	name: string;
}

export interface IProducerCreate {
	name: string;
	imageProfile: string | null;
	email: string;
	office: string;
	companyId: string;
}

export interface ProducerRepository {
	create(data: IProducerCreate): Promise<Producer>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<Producer | null>;
	update(producer:Producer): Promise<Producer>
}
