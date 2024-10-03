import { CompanyRepositoryPrisma } from "../repositories/company.repositories"
import { PublicRepositoryPrisma } from "../repositories/public.repositories"

class PublicUseCase {
    private publicRepository = new PublicRepositoryPrisma()
	constructor(
	) {}




    async getCompanyByPublicCode(publicCode:string){

        const company = await this.publicRepository.findByPublicCode(publicCode)

        return company
        
    }

    async getTopicByPublicCode(publicCode:string){
        const topics = await this.publicRepository.findTopicsByPublicCode(publicCode)
        return topics
    }


    async getPostRecomendationByPostId(postId:string){
        return await this.publicRepository.findPostRecommendationsByPostId(postId)
    }

    
    async getPostsByPublicCode(publicCode:string){

        const posts = await this.publicRepository.findPostsByPublicCode(publicCode)
        return posts
    }

    async getUniquePostByPublicCodeAndPostId({publicCode, postId}:{publicCode:string, postId:string}){

        const post = await this.publicRepository.findPostByPublicCodeAndById(postId)
        if(!post){
            throw new Error("Post não encontrado ou desativado")
        }

        return post
    }

    async getPublicPostsByTopicId({publicCode, topicId}:{publicCode:string, topicId:string}){

        const posts = await this.publicRepository.findPostsByTopicId(publicCode, topicId)

        return posts
    }
    

}

export {PublicUseCase}
