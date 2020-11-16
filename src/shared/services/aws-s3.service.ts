import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';

import { FileType } from '../../common/constants/file-type';
import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';

@Injectable()
export class AwsS3Service {
    private readonly _s3: AWS.S3;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
    ) {
        const options: AWS.S3.Types.ClientConfiguration = {
            apiVersion: '2010-12-01',
            region: 'eu-west-3',
        };

        const awsS3Config = configService.awsS3Config;
        if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
            options.credentials = awsS3Config;
        }

        this._s3 = new AWS.S3(options);
    }

    async getSignedUrl(mimeType: FileType): Promise<any> {
        const fileName = this.generatorService.fileName(
            <string>mime.extension(FileType[mimeType]),
        );

        const key = fileName;
        const params = {
            Bucket: this.configService.awsS3Config.bucketName,
            Key: key,
            Expires: 3600,
            ContentType: mimeType,
            ACL: 'public-read',
        };
        const s3Url = await this._s3.getSignedUrlPromise('putObject', params);
        return {
            fileName,
            s3Url,
        };
    }

    get bucketUrl(): string {
        return `https://${this.configService.awsS3Config.bucketName}.s3.${this.configService.awsS3Config.bucketRegion}.amazonaws.com/`;
    }
}
