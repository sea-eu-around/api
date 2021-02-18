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
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../../../decorators/auth-user.decorator';
import { VoteDto } from '../../../../dto/VoteDto';
import { UserEntity } from '../../../../entities/user.entity';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RolesGuard } from '../../../../guards/roles.guard';
import { AuthUserInterceptor } from '../../../../interceptors/auth-user-interceptor.service';
import { CreateVoteParamDto } from './dto/CreateVoteParamDto';
import { CreateVotePayloadDto } from './dto/CreateVotePayloadDto';
import { DeleteVoteParamDto } from './dto/DeleteVoteParamDto';
import { RetrieveVoteParamDto } from './dto/RetrieveVoteParamDto';
import { UpdateVoteParamDto } from './dto/UpdateVoteParamDto';
import { UpdateVotePayloadDto } from './dto/UpdateVotePayloadDto';
import { VoteService } from './vote.service';

@Controller('groups/:groupId/votes')
@ApiTags('Votes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(AuthUserInterceptor)
export class VoteController {
    constructor(private readonly _voteService: VoteService) {}

    @Get('/:entityType/:entityId')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'entityType',
        type: 'string',
    })
    @ApiParam({
        name: 'entityId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        type: VoteDto,
        status: HttpStatus.OK,
        description: 'successefully-retrieved-votes',
    })
    async retrieve(
        @Param() retrieveVoteParamDto: RetrieveVoteParamDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const votes = await this._voteService.retrieve({
            profileId: user.id,
            groupId: retrieveVoteParamDto.groupId,
            entityType: retrieveVoteParamDto.entityType,
            entityId: retrieveVoteParamDto.entityId,
        });

        return {
            description: 'succesfully retrieved votes',
            data: votes,
        };
    }

    @Post('/:entityType/:entityId')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'entityType',
        type: 'string',
    })
    @ApiParam({
        name: 'entityId',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        type: VoteDto,
        status: HttpStatus.OK,
        description: 'successefully-created-vote',
    })
    async create(
        @Param() createVoteParamDto: CreateVoteParamDto,
        @Body() createVotePayloadDto: CreateVotePayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const vote = await this._voteService.create({
            profileId: user.id,
            groupId: createVoteParamDto.groupId,
            entityType: createVoteParamDto.entityType,
            entityId: createVoteParamDto.entityId,
            voteType: createVotePayloadDto.voteType,
        });

        return {
            description: 'succesfully created vote',
            data: vote,
        };
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        type: VoteDto,
        status: HttpStatus.OK,
        description: 'successefully-updated-vote',
    })
    async update(
        @Param() updateVoteParamDto: UpdateVoteParamDto,
        @Body() updateVotePayloadDto: UpdateVotePayloadDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const vote = await this._voteService.update({
            profileId: user.id,
            groupId: updateVoteParamDto.groupId,
            entityType: updateVoteParamDto.entityType,
            entityId: updateVoteParamDto.entityId,
            voteType: updateVotePayloadDto.voteType,
        });

        return {
            description: 'succesfully updated votes',
            data: vote,
        };
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'groupId',
        type: 'string',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
    })
    @ApiBearerAuth()
    @ApiResponse({
        type: VoteDto,
        status: HttpStatus.OK,
        description: 'successefully-deleted-vote',
    })
    async delete(
        @Param() deleteVoteParamDto: DeleteVoteParamDto,
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const vote = await this._voteService.delete({
            profileId: user.id,
            groupId: deleteVoteParamDto.groupId,
            entityType: deleteVoteParamDto.entityType,
            entityId: deleteVoteParamDto.entityId,
        });

        return {
            description: 'succesfully deleted votes',
            data: vote,
        };
    }
}
