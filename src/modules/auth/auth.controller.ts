import { MailerService } from '@nestjs-modules/mailer';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PayloadSuccessDto } from '../../common/dto/PayloadSuccessDto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserDto } from '../../dto/UserDto';
import { UserEntity } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserVerificationQueryDto } from './dto/UserVerificationQueryDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
        private readonly _mailerService: MailerService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<PayloadSuccessDto> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        const token = await this.authService.createToken(userEntity);

        return {
            description: 'User info with access token',
            data: new LoginPayloadDto(userEntity.toDto(), token),
        };
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserDto,
        description: 'Successfully Registered',
    })
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
    ): Promise<PayloadSuccessDto> {
        const createdUser = await this.userService.createUser(userRegisterDto);

        return {
            description: 'Successfully Registered',
            data: createdUser,
        };
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Verified' })
    async userVerification(
        @Body() userVerificationQueryDto: UserVerificationQueryDto,
    ): Promise<PayloadSuccessDto> {
        const verifiedUser = await this.userService.verifyUser(
            userVerificationQueryDto,
        );

        return {
            description: 'Successfully Verified',
            data: verifiedUser,
        };
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    async getCurrentUser(
        @AuthUser() user: UserEntity,
    ): Promise<PayloadSuccessDto> {
        const userWithProfile = await this.authService.getUserWithProfile(user);

        await this._mailerService.sendMail({
            to: 'ladislas14@gmail.com', // list of receivers
            from: 'sea-eu.around@univ-brest.fr', // sender address
            subject: 'Testing Nest MailerModule ✔', // Subject line
            text: 'welcome', // plaintext body
            html: '<b>welcome</b>', // HTML body content
        });

        return {
            description: 'current user info',
            data: userWithProfile,
        };
    }
}
