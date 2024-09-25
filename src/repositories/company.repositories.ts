import { PrismaClient } from "@prisma/client";
import {
	Company,
	CompanyCreate,
	CompanyUpdate,
	CompanyRepository,
	CompanyHome,
	CompanySearch,
} from "../interfaces/company.interface";
import { IProducerCompany, Producer } from "../interfaces/producer.interface";

const prisma = new PrismaClient();

class CompanyRepositoryPrisma implements CompanyRepository {
	async create(data: CompanyCreate): Promise<Company> {
		try {
			const company = await prisma.company.create({
				data: {
					name: data.name,
					description: data.description,
					ownerId: data.ownerId,
					image: data.image,
					banner: data.banner,
				},
				select: {
					id: true,
					description: true,
					image: true,
					banner: true,
					name: true,
					ownerId: true,
					posts: true,
				},
			});
			return company;
		} catch (error: any) {
			throw new Error(`Failed to create company: ${error.message}`);
		}
	}

	async findById(id: string): Promise<Company | null> {
		const company = await prisma.company.findUnique({
			where: { id },
			include: {
				owner: {
					include:{
						subscription:{
							select:{
							  canAttachFile:true,
							  canHaveManyProfiles:true,
							  description:true,
							  maxPostNumber:true,
							  id:true
							}
						  }
					}
				},
				posts: {
					include: {
						author: true,
						topics: {
							select: {
								topic: {
									select: {
										description: true,
										id: true,
									},
								},
							},
						},
					},
				},
			},
		});
		return company;
	}

	async update(data: CompanyUpdate): Promise<Company> {
		const company = await prisma.company.update({
			where: { id: data.id },
			data: {
				name: data.name,
				description: data.description,
				banner: data.banner,
				image: data.image,
			},
			include: {
				owner: {
					include:{
						subscription:{
							select:{
							  canAttachFile:true,
							  canHaveManyProfiles:true,
							  description:true,
							  maxPostNumber:true,
							  id:true
							}
						  }
					}
				},
				posts: true,
				producers: true,
			},
		});
		return company;
	}

	async delete(id: string): Promise<void> {
		await prisma.company.delete({
			where: { id },
		});
	}

	async getAllCompaniesByUserId(
		externalId: string
	): Promise<CompanyHome[] | []> {
		const companies: CompanyHome[] | [] = await prisma.company.findMany({
			where: { ownerId: externalId },
		});

		return companies;
	}

	async getAllProducersByCompanyId(
		id: string
	): Promise<IProducerCompany[] | null> {
		const producers: IProducerCompany[] | null = await prisma.producer.findMany(
			{
				where: {
					companyId: id,
				},
			}
		);
		return producers;
	}

	async updatePublicCode(data: {
		id: string;
		publicCode: string;
	}): Promise<Company> {
		const company = await prisma.company.update({
			where: { id: data.id },
			data: {
				publicCode: data.publicCode,
			},
			include: {
				owner: {
					include:{
						subscription:{
							select:{
							  canAttachFile:true,
							  canHaveManyProfiles:true,
							  description:true,
							  maxPostNumber:true,
							  id:true
							}
						  }
					}
				},
				posts: true,
				producers: true,
			},
		});
		return company;
	}

	async verifyIfPublicCodeIsValid(publicCode: string) {
		const hasCompany = await prisma.company.findUnique({
			where: {
				publicCode,
			},
		});

		if (hasCompany) {
			return false;
		}
		return true;
	}

	async getCompanyByName(name: string): Promise<CompanySearch[]> {
		const companies = await prisma.company.findMany({
			where:{
				name:{
					contains:name,
					mode:"insensitive"
				}
			},orderBy:{
				posts: {
					_count: 'desc',
				  },
			},
			select:{
				id: true,
				name: true,
				description: true,
				banner: true,
				image: true,
				publicCode:true,
				_count:{
					select:{
						posts:true
					}
				}
			},take:10
		})

		return companies
	}
}

export { CompanyRepositoryPrisma };
