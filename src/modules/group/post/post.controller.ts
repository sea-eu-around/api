import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotImplementedException,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { GroupDto } from '../../../dto/GroupDto';
import { PostDto } from '../../../dto/PostDto';
import { UserEntity } from '../../../entities/user.entity';
import { AuthGuard } from '../../../guards/auth.guard';
import { RolesGuard } from '../../../guards/roles.guard';
import { AuthUserInterceptor } from '../../../interceptors/auth-user-interceptor.service';
import { CreatePostParamsDto } from './dto/CreatePostParamsDto';
import { CreatePostPayloadDto } from './dto/CreatePostPayloadDto';
import { RetrieveGroupPostParamsDto } from './dto/RetrieveGroupPostParamsDto';
import { RetrieveGroupPostQueryDto } from './dto/RetrieveGroupPostQueryDto';
import { PostService } from './post.service';

@Controller('/groups/:groupId/posts')
@ApiTags('Posts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class PostController {
    constructor(private readonly _postService: PostService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiQuery({
        name: 'page',
    })
    @ApiQuery({
        name: 'limit',
    })
    @ApiResponse({
        type: PostDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-posts',
    })
    async retrieve(
        @Param() retrieveGroupPostParamDto: RetrieveGroupPostParamsDto,
        @Query() retrieveGroupPostQueryDto: RetrieveGroupPostQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit =
            retrieveGroupPostQueryDto.limit > 100
                ? 100
                : retrieveGroupPostQueryDto.limit;
        const page = retrieveGroupPostQueryDto.page;

        const posts = await this._postService.retrieve(
            user.id,
            retrieveGroupPostParamDto.groupId,
            { page, limit },
        );

        return {
            description: 'succesfully retrieved posts',
            data: posts.items,
            meta: posts.meta,
        };
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-post',
        type: PostDto,
    })
    retrieveOne(): PayloadSuccessDto {
        throw new NotImplementedException();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-post',
        type: GroupDto,
    })
    async create(
        @Param() createPostParamsDto: CreatePostParamsDto,
        @Body() createPostPayloadDto: CreatePostPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const post = await this._postService.create(
            user.id,
            createPostParamsDto.groupId,
            createPostPayloadDto,
        );

        return {
            description: 'successefully-created-post',
            data: post,
        };
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-updated-group',
        type: PostDto,
    })
    update(): PayloadSuccessDto {
        throw new NotImplementedException();
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-post',
    })
    delete(): PayloadSuccessDto {
        throw new NotImplementedException();
    }
}
