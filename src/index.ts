import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/user.routes";
import { webhookClerk } from "./routes/clerk.routes";
import { companyRoutes } from "./routes/company.routes";
import { topicRoutes } from "./routes/topic.routes";
import { postRoutes } from "./routes/post.routes";
import { producerRoutes } from "./routes/producer.routes";
import { stripeRoutes } from "./routes/stripe.routes";
import fastifyRawBody from "fastify-raw-body";

const app: FastifyInstance = fastify({ logger: false });
const port = parseInt(process.env.PORT as string);

app.register(cors, {
	origin: ["http://localhost:5173", "https://mestresonline.vercel.app"],
});
app.register(async function (fastify) {
    fastify.register(fastifyRawBody, {
        field: 'rawBody',
    });
    fastify.register(stripeRoutes);
}, { prefix: "stripe" });

app.register(userRoutes, {
	prefix: "/users",
});
app.register(companyRoutes, {
	prefix: "/companies",
});
app.register(webhookClerk, {
	prefix: "/clerk",
});
app.register(topicRoutes, {
	prefix: "/topics",
});
app.register(postRoutes, {
	prefix: "/posts",
});
app.register(producerRoutes, {
	prefix: "/producers",
});

app.listen({ port: port || 3000, host: "0.0.0.0" }, function (err, address) {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});
