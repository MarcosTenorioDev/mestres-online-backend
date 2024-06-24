import { FastifyInstance } from "fastify";
import { UserCreate, UserUpdate } from "../interfaces/user.interface";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import { UserUseCase } from "../usecases/user.usecase";

const userRepository = new UserRepositoryPrisma();
const userUseCase = new UserUseCase(userRepository);

export async function userRoutes(fastify: FastifyInstance) {
    registerUserRoute(fastify);
    getUserRoute(fastify)
}

function registerUserRoute(fastify: FastifyInstance) {
    fastify.post<{ Body: UserCreate }>('/', async (req, reply) => {
        const { externalId, firstName, lastName, email } = req.body;
        try {
            const data = await userUseCase.create({ externalId, firstName, lastName, email });
            reply.code(201).send(data);
        } catch (error) {
            reply.code(400).send(error);
        }
    });
};

function getUserRoute(fastify: FastifyInstance) {
    fastify.addHook("preHandler", jwtValidator);
    fastify.get<{ Params: { externalId: string } }>('/', async (req, reply) => {
        const externalId = req.params.externalId;
        try {
            const data = await userUseCase.findUserByExternalOrId(externalId);
            reply.code(200).send(data);
        } catch (error) {
            reply.code(404).send(error);
        }
    });
}