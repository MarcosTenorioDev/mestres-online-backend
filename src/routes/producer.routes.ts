import { FastifyInstance } from "fastify";
import { IProducerCreate } from "../interfaces/producer.interface";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { ProducerRepositoryPrisma } from "../repositories/producer.repositories";
import { ProducerUseCase } from "../usecases/producer.usecase";

const producerRepository = new ProducerRepositoryPrisma()
const producerUseCase = new ProducerUseCase(producerRepository)
export async function producerRoutes(fastify:FastifyInstance){
    createProducer(fastify)
}

function createProducer (fastify: FastifyInstance){
    fastify.post<{Body: IProducerCreate}>("/", {
        preHandler:[jwtValidator],
        handler: async (req:any, res:any)=> {
            const { companyId, email, imageProfile, name, office} = req.body
            const externalId = req.params.externalId;
            try{
                const data = await producerUseCase.create({companyId, email, imageProfile, name, office})
                res.code(201).send(data);
            }catch(err){
                res.code(400).send(err)
            }
        }
    })
}