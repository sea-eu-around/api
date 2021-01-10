import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import { CreatePostParamDto } from './dto/CreatePostParamDto';
import { CreatePostPayloadDto } from './dto/CreatePostPayloadDto';
import { DeletePostParamDto } from './dto/DeletePostParamDto';
import { RetrievePostIdParamDto } from './dto/RetrievePostIdParamDto';
import { RetrievePostParamsDto } from './dto/RetrievePostParamsDto';
import { RetrievePostQueryDto } from './dto/RetrievePostQueryDto';
import { UpdatePostParamDto } from './dto/UpdatePostParamDto';
import { UpdatePostPayloadDto } from './dto/UpdatePostPayloadDto';
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
        @Param() retrievePostParamDto: RetrievePostParamsDto,
        @Query() retrievePostQueryDto: RetrievePostQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const limit =
            retrievePostQueryDto.limit > 100 ? 100 : retrievePostQueryDto.limit;
        const page = retrievePostQueryDto.page;

        const posts = await this._postService.retrieve(
            user.id,
            retrievePostParamDto.groupId,
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
    async retrieveOne(
        @Param() retrievePostIdParamDto: RetrievePostIdParamDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const post = await this._postService.retrieveOne({
            profileId: user.id,
            ...retrievePostIdParamDto,
        });

        return {
            description: 'successefully-retrieved-post',
            data: post,
        };
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
        @Param() createPostParamsDto: CreatePostParamDto,
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
        description: 'successefully-updated-post',
        type: PostDto,
    })
    update(
        @Param() updatePostParamDto: UpdatePostParamDto,
        @Body() updatePostPayloadDto: UpdatePostPayloadDto,
        @AuthUser() user: UserEntity,
    ): PayloadSuccessDto {
        const post = this._postService.update({
            profileId: user.id,
            params: updatePostParamDto,
            payload: updatePostPayloadDto,
        });

        return {
            description: 'successefully-updated-post',
            data: post,
        };
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
    async delete(
        @Param() deletePostParamDto: DeletePostParamDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._postService.delete({
            profileId: user.id,
            params: deletePostParamDto,
        });

        return {
            description: 'successefully-deleted-post',
            data: null,
        };
    }
}
