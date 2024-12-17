import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
    private readonly bucketName: string = 'death-quiz';
    private readonly s3Client: S3Client;
    
    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION')
        });
    }

    async upload(fileName: string, file: Buffer): Promise<object> {
        
        const ext = fileName.split(".").pop();
        const newFileName = Date.now() + "." + ext;
        
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: newFileName,
                    Body: file
                })
            )

            const link = `https://${this.bucketName}.s3.amazonaws.com/${newFileName}`;
            return { link }
        } catch (error) {
            console.log(error);
        }
    } 

    async remove(id: string) : Promise<object>{
        try {
            const resp = await this.s3Client.send(new DeleteObjectCommand ({
                Bucket: this.bucketName,
                Key: id
            }))

            return { resp, deleted: true }
        } catch (error) {
            console.log(error);
        }
    }
}
