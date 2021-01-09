import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { GroupDto } from '../../../dto/GroupDto';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { AuthUserInterceptor } from '../../../interceptors/auth-user-interceptor.service';
import { CreateGroupPostParamDto } from '../dto/CreateGroupPostParamDto';
import { CreateGroupPostPayloadDto } from '../dto/CreateGroupPostPayloadDto';
import { PostService } from './post.service';

@Controller('/groups/:groupId/posts')
@ApiTags('Posts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class PostController {
    constructor(private readonly _postService: PostService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-group-post',
        type: GroupDto,
    })
    async createGroupPost(
        @Param() createGroupPostParamDto: CreateGroupPostParamDto,
        @Body() createGroupPostPayloadDto: CreateGroupPostPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const post = await this._postService.create({
            createGroupPostPayloadDto,
            profileId: user.id,
            ...createGroupPostParamDto,
        });

        return {
            description: 'successefully-created-group-member',
            data: post,
        };
    }

    /*
    @Get(':groupId/post')

    @Get(':groupId/post/:postId')

    @Delete(':groupId/post/:postId')

    @Patch(':groupId/post/:postId')

    @Patch(':groupId/post/approve')
    */
}
