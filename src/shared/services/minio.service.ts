import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import * as Minio from 'minio';

import { FileType } from '../../common/constants/file-type';
import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';

@Injectable()
export class MinioService {
    private readonly _minioClient: Minio.Client;
    private readonly _bucketName: string;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
    ) {
        this._minioClient = new Minio.Client(this.configService.minioConfig);
        this._bucketName = this.configService.bucketName;
    }

    async getSignedUrl(mimeType: FileType): Promise<any> {
        const fileName = this.generatorService.fileName(
            <string>mime.extension(mimeType),
        );

        const s3Url = await this._minioClient.presignedPutObject(
            this._bucketName,
            `public/${fileName}`,
            3600,
        );

        return {
            fileName,
            s3Url,
        };
    }

    deleteFile(filename: string): Promise<void> {
        return this._minioClient.removeObject(this._bucketName, filename);
    }

    get bucketUrl(): string {
        return `https://${this.configService.minioConfig.endPoint}`;
    }
}
