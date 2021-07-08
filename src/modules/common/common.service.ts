import { Injectable } from '@nestjs/common';

import { FileType } from '../../common/constants/file-type';
import { MinioService } from '../../shared/services/minio.service';

@Injectable()
export class CommonService {
    constructor(private readonly _minioService: MinioService) {}

    async getSignedUrl(contentType: FileType): Promise<any> {
        return this._minioService.getSignedUrl(contentType);
    }
}
