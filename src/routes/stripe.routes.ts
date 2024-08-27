import { FastifyInstance } from "fastify";
import { Stripe } from "stripe";
import { env } from "../env";
import { SubscriptionRepositoryPrisma } from "../repositories/subscription.repositores";
import { ISubscriptionCreate, ISubscriptionUpdate } from "../interfaces/subscription.interface";
const subscriptionRepository = new SubscriptionRepositoryPrisma();
export async function stripeRoutes(fastify: FastifyInstance) {
	fastify.get("/", (req: any, res: any) => {
		res.send({ ok: "its ok" });
	});

	fastify.post(
		"/",
		{
			config: {
				rawBody: true,
			},
		},
		async (req: any, res: any) => {
			//mudar para produção ao colocar o backend no ar
			const endpointSecret = env.STRIPE_ENDPOINT_SECRET;
			const stripe = new Stripe(env.STRIPE_SECRET_KEY);
			const sig = req.headers["stripe-signature"];
			let event;
			try {
				event = stripe.webhooks.constructEvent(
					req.rawBody,
					sig,
					endpointSecret!
				);
			} catch (err: any) {
				res.status(400).send(`Webhook Error: ${err.message}`);
				return;
			}
			const data: any = event.data;

			switch (event.type) {
				case "checkout.session.completed":{
					console.log('chegou aqui session completed')
					console.log(event.type)
					const session = await stripe.checkout.sessions.retrieve(
						data.object.id,
						{
							expand: ["line_items"],
						}
					);

					const customerId = session?.customer;
					const customer: any = await stripe.customers.retrieve(
						customerId as string
					);

					const userId = session.client_reference_id;
					const priceId = session.line_items?.data[0]?.price?.id;
					const customerEmail = customer.email;

					let payload: ISubscriptionCreate;
					const today = new Date();
					const nextMonth = new Date(today);
					// Adiciona um mês à data
					nextMonth.setMonth(today.getMonth() + 1);
					const nextYear = new Date(today);
					nextYear.setFullYear(today.getFullYear() + 1);

					// console.log(nextYear.toISOString())

					//Criando as subscriptions
					switch (priceId) {
						case env.PRODUCT_ID_BASIC_MONTHLY:
							//Plano básico mensal - 15 Reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: false,
								canAttachFile: false,
								endDate: nextMonth.toISOString(),
								maxPostNumber: 50,
								userId: userId,
								description:"Plano Básico - Mensal"
							};

							subscriptionRepository.create(payload);
							break;

						case env.PRODUCT_ID_PROFESSIONAL_MONTHLY:
							//plano profissional mensal - 45 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: true,
								canAttachFile: true,
								endDate: nextMonth.toISOString(),
								maxPostNumber: 250,
								userId: userId,
								description:"Plano Profissional - Mensal"
							};

							subscriptionRepository.create(payload);
							break;

						case env.PRODUCT_ID_BASIC_YEARLY:
							//plano básico anual - 130 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: false,
								canAttachFile: false,
								endDate: nextYear.toISOString(),
								maxPostNumber: 50,
								userId: userId,
								description:"Plano Básico - Anual"
							};

							subscriptionRepository.create(payload);
							break;
						
						case env.PRODUCT_ID_PROFESSIONAL_YEARLY:
							//plano profissional anual - 430 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: true,
								canAttachFile: true,
								endDate: nextYear.toISOString(),
								maxPostNumber: 250,
								userId: userId,
								description:"Plano Profissional - Anual"
							};

							subscriptionRepository.create(payload);
							break;

						default:
							break
					}
					break;
				}

				case "customer.subscription.deleted":{
					console.log(event.type)
					const session = await stripe.subscriptions.retrieve(
						data.object.id
					);
					const customerId = session?.customer;

					await subscriptionRepository.revokeSubscription(customerId as string)
					break;
				}
				case "customer.subscription.updated":{
					console.log('chegou aqui no update')
					console.log('Update plan',event.type)
				
					const session:any = await stripe.subscriptions.retrieve(
						data.object.id
					);
					const customerId = session?.customer;
					const customer: any = await stripe.customers.retrieve(
						customerId as string
					);


					const priceId = session.plan.id
					const customerEmail = customer.email;

					let payload: ISubscriptionUpdate;
					const today = new Date();
					const nextMonth = new Date(today);
					// Adiciona um mês à data
					nextMonth.setMonth(today.getMonth() + 1);
					const nextYear = new Date(today);
					nextYear.setFullYear(today.getFullYear() + 1);

					// console.log(nextYear.toISOString())
					//update subscriptions
					switch (priceId) {
						case env.PRODUCT_ID_BASIC_MONTHLY:
							//Plano básico mensal - 15 Reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: false,
								canAttachFile: false,
								endDate: nextMonth.toISOString(),
								maxPostNumber: 50,
								description:"Plano Básico - Mensal"
							};

							subscriptionRepository.update(customerEmail, payload);
							break;

						case env.PRODUCT_ID_PROFESSIONAL_MONTHLY:
							//plano profissional mensal - 45 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: true,
								canAttachFile: true,
								endDate: nextMonth.toISOString(),
								maxPostNumber: 250,
								description:"Plano Profissional - Mensal"
							};

							subscriptionRepository.update(customerEmail, payload);
							break;

						case env.PRODUCT_ID_BASIC_YEARLY:
							//plano básico anual - 130 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: false,
								canAttachFile: false,
								endDate: nextYear.toISOString(),
								maxPostNumber: 50,
								description:"Plano Básico - Anual"
							};

							subscriptionRepository.update(customerEmail, payload);
							break;
						
						case env.PRODUCT_ID_PROFESSIONAL_YEARLY:
							//plano profissional anual - 430 reais
							payload = {
								billingEmail: customerEmail,
								customerId: customerId,
								canHaveManyProfiles: true,
								canAttachFile: true,
								endDate: nextYear.toISOString(),
								maxPostNumber: 250,
								description:"Plano Profissional - Anual"
							};

							subscriptionRepository.update(customerEmail, payload);
							break;

						default:
							break
					}
					break;
				}
				
				default:
					console.log(`Unhandled event type ${event.type}`);
			}

			// Return a 200 res to acknowledge receipt of the event
			res.send();
		}
	);
}
