import { Injectable } from '@nestjs/common';

import { FileType } from '../../common/constants/file-type';
import { AwsS3Service } from '../../shared/services/aws-s3.service';

@Injectable()
export class CommonService {
    constructor(private readonly _awsS3Service: AwsS3Service) {}

    async getSignedUrl(contentType: FileType): Promise<any> {
        return this._awsS3Service.getSignedUrl(contentType);
    }
}
