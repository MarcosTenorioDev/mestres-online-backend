import { prisma } from "../db/prisma-client";
import {
	ISubscriptionCreate,
	ISubscriptionUpdate,
	SubscriptionRepository,
} from "../interfaces/subscription.interface";

class SubscriptionRepositoryPrisma implements SubscriptionRepository {
	async create(data: ISubscriptionCreate): Promise<void> {
		const user = await prisma.user.findFirstOrThrow({
			where: {
				OR: [{ id: data.userId as string }, { email: data.billingEmail }],
			},
		});

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				isPaid: true,
			},
		});

		const subscription = await prisma.subscription.create({
			data: {
				billingEmail: data.billingEmail,
				customerId: data.customerId,
				canAttachFile: data.canAttachFile,
				canHaveManyProfiles: data.canHaveManyProfiles,
				endDate: data.endDate,
				maxPostNumber: data.maxPostNumber,
				userId: user.id,
				description:data.description
			},
		});

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				isPaid: true,
				subscriptionId: subscription.id,
			},
		});
	}

	async revokeSubscription(id: string): Promise<void> {
		const user = await prisma.user.findFirstOrThrow({
			where: {
				subscriptionId: id,
			},
		});

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				isPaid: false,
			},
		});

		await prisma.subscription.delete({
			where: {
				id,
			},
		});
	}


	async update(billingEmail: string, data: Partial<ISubscriptionUpdate>): Promise<void> {
		const subscription = await prisma.subscription.findUniqueOrThrow({
			where: {
				billingEmail,
			},
		});

		await prisma.subscription.update({
			where: {
				billingEmail,
			},
			data: {
				billingEmail: data.billingEmail ?? subscription.billingEmail,
				customerId: data.customerId ?? subscription.customerId,
				canAttachFile: data.canAttachFile ?? subscription.canAttachFile,
				canHaveManyProfiles: data.canHaveManyProfiles ?? subscription.canHaveManyProfiles,
				endDate: data.endDate ?? subscription.endDate,
				maxPostNumber: data.maxPostNumber ?? subscription.maxPostNumber,
				description: data.description ?? subscription.description,
			},
		});
	}
}

export { SubscriptionRepositoryPrisma };
