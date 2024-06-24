import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { userRoutes } from './routes/user.routes';

const app: FastifyInstance = fastify({logger: true})
const port = parseInt(process.env.PORT as string);

app.register(cors, {
    origin: [
        'http://localhost:5173',
        'https://mestresonline.vercel.app'
    ]
});

app.register(userRoutes, {
    prefix: '/users',
});

app.listen({ port: port || 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
})