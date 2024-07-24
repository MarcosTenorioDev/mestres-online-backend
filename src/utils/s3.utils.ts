import S3 from 'aws-sdk/clients/s3';
import { env } from '../env';
class S3Storage {
	private client: S3;

	constructor() {
		this.client = new S3({
			region: env.AWS_BUCKET_REGION,
			accessKeyId: env.AWS_ACCESS_KEY,
			secretAccessKey: env.AWS_SECRET_KEY,
		});
	}

    async uploadFile(fileName: string, fileContent: Buffer) {
        const params = {
          Bucket: env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: fileContent,
          ContentType: 'image/*',
        };
      
        return this.client.upload(params).promise();
      }
}

export default S3Storage;
