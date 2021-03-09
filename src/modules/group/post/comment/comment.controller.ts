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

import { PayloadSuccessDto } from '../../../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../../../decorators/auth-user.decorator';
import { CommentDto } from '../../../../dto/CommentDto';
import { UserEntity } from '../../../../entities/user.entity';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RolesGuard } from '../../../../guards/roles.guard';
import { AuthUserInterceptor } from '../../../../interceptors/auth-user-interceptor.service';
import { CommentService } from './comment.service';
import { CreateCommentsParamsDto } from './dto/CreateCommentParamsDto';
import { CreateCommentPayloadDto } from './dto/CreateCommentPayloadDto';
import { DeleteCommentParamsDto } from './dto/DeleteCommentParamsDto';
import { RetrieveCommentsParamsDto } from './dto/RetrieveCommentsParamsDto';
import { RetrieveCommentsQueryDto } from './dto/RetrieveCommentsQueryDto';
import { UpdateCommentParamsDto } from './dto/UpdateCommentParamsDto';
import { UpdateCommentPayloadDto } from './dto/UpdateCommentPayloadDto';

@Controller('/groups/:groupId/posts/:postId/comments')
@ApiTags('Comments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class CommentController {
    constructor(private readonly _commentService: CommentService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'postId',
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
        type: CommentDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-comments',
    })
    async retrieve(
        @Param() retrieveCommentsParamsDto: RetrieveCommentsParamsDto,
        @Query() retrieveCommentsQueryDto: RetrieveCommentsQueryDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const comments = await this._commentService.retrieve({
            profileId: user.id,
            ...retrieveCommentsParamsDto,
            options: {
                ...retrieveCommentsQueryDto,
            },
        });

        return {
            description: 'successefully-retrieved-comments',
            data: comments.items,
            meta: comments.meta,
            links: comments.links,
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
    @ApiParam({
        name: 'postId',
        type: 'string',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-retrieved-comment',
        type: CommentDto,
    })
    retrieveOne(): PayloadSuccessDto {
        throw new NotImplementedException();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'postId',
        type: 'string',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'successefully-created-comment',
        type: CommentDto,
    })
    async create(
        @Param() params: CreateCommentsParamsDto,
        @Body() payload: CreateCommentPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const comment = await this._commentService.create({
            profileId: user.id,
            ...params,
            payload,
        });

        return {
            description: 'successefully-created-comment',
            data: comment,
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
    @ApiParam({
        name: 'postId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'successefully-updated-group',
        type: CommentDto,
    })
    async update(
        @Param() params: UpdateCommentParamsDto,
        @Body() payload: UpdateCommentPayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const comment = await this._commentService.update({
            profileId: user.id,
            ...params,
            payload,
        });

        return {
            description: 'successefully-updated-comment',
            data: comment,
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
    @ApiParam({
        name: 'postId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-comment',
    })
    async delete(
        @Param() params: DeleteCommentParamsDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        await this._commentService.delete({
            profileId: user.id,
            ...params,
        });

        return {
            description: 'successefully-deleted-comment',
            data: null,
        };
    }
}
