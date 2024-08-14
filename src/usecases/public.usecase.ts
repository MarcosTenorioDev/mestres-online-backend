import { CompanyRepositoryPrisma } from "../repositories/company.repositories"
import { PublicRepositoryPrisma } from "../repositories/public.repositories"

class PublicUseCase {
    private publicRepository = new PublicRepositoryPrisma()
	constructor(
	) {}


    async verifyIfCompanyIsPaid(publicCode:string){
        return await this.publicRepository.verifyIfCompanyIsPaid(publicCode)
    }

    async validateReq(publicCode:string){
        const isPaid = await this.publicRepository.verifyIfCompanyIsPaid(publicCode)

        if(!isPaid){
            throw new Error("Esse perfil não aderiu ao plano de API, por favor, contate o suporte técnico")
        }
    }
    

    async getCompanyByPublicCode(publicCode:string){
        await this.validateReq(publicCode)

        const company = await this.publicRepository.findByPublicCode(publicCode)

        return company
        
    }

    async getTopicByPublicCode(publicCode:string){
        await this.validateReq(publicCode)

        const topics = await this.publicRepository.findTopicsByPublicCode(publicCode)
        return topics
    }

    
    async getPostsByPublicCode(publicCode:string){
        await this.validateReq(publicCode)

        const posts = await this.publicRepository.findPostsByPublicCode(publicCode)
        return posts
    }

    async getUniquePostByPublicCodeAndPostId({publicCode, postId}:{publicCode:string, postId:string}){
        await this.validateReq(publicCode)

        const post = await this.publicRepository.findPostByPublicCodeAndById(postId)
        if(!post){
            throw new Error("Post não encontrado ou desativado")
        }

        return post
    }

    async getPublicPostsByTopicId({publicCode, topicId}:{publicCode:string, topicId:string}){
        await this.validateReq(publicCode)

        const posts = await this.publicRepository.findPostsByTopicId(publicCode, topicId)

        return posts
    }
    



}

export {PublicUseCase}
