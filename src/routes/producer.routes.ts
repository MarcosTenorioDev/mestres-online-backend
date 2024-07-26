import { FastifyInstance } from "fastify";
import { IProducerCreate } from "../interfaces/producer.interface";
import { jwtValidator } from "../middlewares/auth.middlewares";
import { ProducerRepositoryPrisma } from "../repositories/producer.repositories";
import { ProducerUseCase } from "../usecases/producer.usecase";
import { CompanyRepositoryPrisma } from "../repositories/company.repositories";
import { UserRepositoryPrisma } from "../repositories/user.repositories";

const producerRepository = new ProducerRepositoryPrisma()
const companyRepository = new CompanyRepositoryPrisma()
const userRepository = new UserRepositoryPrisma()
const producerUseCase = new ProducerUseCase(producerRepository,companyRepository,userRepository)
export async function producerRoutes(fastify:FastifyInstance){
    createProducer(fastify)
    deleteProducerById(fastify)
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

function deleteProducerById(fastify:FastifyInstance){
    fastify.delete("/:id", {preHandler: [jwtValidator], handler: async (req:any, res:any) => {
        const {id, externalId} = req.params
        try{
            await producerUseCase.delete(id, externalId)
            res.code(204).send();
        }catch(err){
            res.code(400).send(`${err}`)
        }
    }})
}