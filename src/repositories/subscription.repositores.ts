import { prisma } from "../db/prisma-client";
import {
	ISubscriptionCreate,
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

		await prisma.subscription.create({
			data: {
				billingEmail: data.billingEmail,
				customerId: data.customerId,
				canAttachFile: data.canAttachFile,
				canHaveManyProfiles: data.canHaveManyProfiles,
				endDate: data.endDate,
				maxPostNumber: data.maxPostNumber,
				userId: user.id,
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
}

export { SubscriptionRepositoryPrisma };
