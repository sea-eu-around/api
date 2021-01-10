import {
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
import { RetrieveCommentsParamsDto } from './dto/RetrieveCommentsParamsDto';
import { RetrieveCommentsQueryDto } from './dto/RetrieveCommentsQueryDto';

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
    create(): PayloadSuccessDto {
        throw new NotImplementedException();
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
    @ApiParam({
        name: 'postId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'successefully-deleted-comment',
    })
    delete(): PayloadSuccessDto {
        throw new NotImplementedException();
    }
}
