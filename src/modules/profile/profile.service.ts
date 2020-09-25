/* eslint-disable complexity */
import { Injectable } from '@nestjs/common';

import { StudentProfileRepository } from '../../repositories/Studentprofile.repository';
import { TeacherProfileRepository } from '../../repositories/teacherProfile.repository';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';

@Injectable()
export class ProfileService {
    constructor(
        public readonly studentProfileRepository: StudentProfileRepository,
        public readonly teacherProfileRepository: TeacherProfileRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
    ) {}
}
