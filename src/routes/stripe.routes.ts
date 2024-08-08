import { FastifyInstance } from "fastify";
import { Stripe } from "stripe";
import { env } from "../env";

export async function stripeRoutes(fastify: FastifyInstance) {

  fastify.get("/", (req: any, res: any) => {
    res.send({ ok: "its ok" });
  });

  fastify.post("/", {
    config: {
      rawBody: true
    }},async (req: any, res: any) => {

    //mudar para produção ao colocar o backend no ar
    const endpointSecret = env.STRIPE_ENDPOINT_SECRET
    const stripe = new Stripe(env.STRIPE_SECRET_KEY)
    const sig = req.headers['stripe-signature'];
    let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret!);
  } catch (err : any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.log("--------------Deu erro-------------------")
    console.log(err)
    console.log("---------------------------------")

    return;
  }
  console.log(event)
  switch (event.type) {
    case 'charge.captured':
      const chargeCaptured = event.data.object;
      // Then define and call a function to handle the event charge.captured
      break;
    case 'charge.expired':
      const chargeExpired = event.data.object;
      // Then define and call a function to handle the event charge.expired
      break;
    case 'charge.failed':
      const chargeFailed = event.data.object;
      // Then define and call a function to handle the event charge.failed
      break;
    case 'charge.pending':
      const chargePending = event.data.object;
      // Then define and call a function to handle the event charge.pending
      break;
    case 'charge.refunded':
      const chargeRefunded = event.data.object;
      // Then define and call a function to handle the event charge.refunded
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      // Then define and call a function to handle the event charge.succeeded
      break;
    case 'charge.updated':
      const chargeUpdated = event.data.object;
      // Then define and call a function to handle the event charge.updated
      break;
    case 'charge.dispute.closed':
      const chargeDisputeClosed = event.data.object;
      // Then define and call a function to handle the event charge.dispute.closed
      break;
    case 'charge.dispute.created':
      const chargeDisputeCreated = event.data.object;
      // Then define and call a function to handle the event charge.dispute.created
      break;
    case 'charge.dispute.funds_reinstated':
      const chargeDisputeFundsReinstated = event.data.object;
      // Then define and call a function to handle the event charge.dispute.funds_reinstated
      break;
    case 'charge.dispute.funds_withdrawn':
      const chargeDisputeFundsWithdrawn = event.data.object;
      // Then define and call a function to handle the event charge.dispute.funds_withdrawn
      break;
    case 'charge.dispute.updated':
      const chargeDisputeUpdated = event.data.object;
      // Then define and call a function to handle the event charge.dispute.updated
      break;
    case 'charge.refund.updated':
      const chargeRefundUpdated = event.data.object;
      // Then define and call a function to handle the event charge.refund.updated
      break;
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      break;
    case 'payment_intent.amount_capturable_updated':
      const paymentIntentAmountCapturableUpdated = event.data.object;
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    case 'payment_intent.partially_funded':
      const paymentIntentPartiallyFunded = event.data.object;
      // Then define and call a function to handle the event payment_intent.partially_funded
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentPaymentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case 'payment_intent.processing':
      const paymentIntentProcessing = event.data.object;
      // Then define and call a function to handle the event payment_intent.processing
      break;
    case 'payment_intent.requires_action':
      const paymentIntentRequiresAction = event.data.object;
      // Then define and call a function to handle the event payment_intent.requires_action
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'payment_link.created':
      const paymentLinkCreated = event.data.object;
      // Then define and call a function to handle the event payment_link.created
      break;
    case 'payment_link.updated':
      const paymentLinkUpdated = event.data.object;
      // Then define and call a function to handle the event payment_link.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
    
  });
}