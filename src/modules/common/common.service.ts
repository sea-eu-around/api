import { Injectable } from '@nestjs/common';

import { AwsS3Service } from '../../shared/services/aws-s3.service';

@Injectable()
export class CommonService {
    constructor(private readonly _awsS3Service: AwsS3Service) {}

    async getSignedUrl(contentType: string): Promise<any> {
        return this._awsS3Service.getSignedUrl(contentType);
    }
}
