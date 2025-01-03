import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ActiveUser } from './decorators/active-user.decorator';
import { User } from '@prisma/client';
import { Public } from './decorators/public.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@ActiveUser() user: User) {
    return {
      message: 'Sign in successful',
      data: {
        user: user,
      },
    };
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return {
      message: 'Sign up successful',
      data: user,
    };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Logged out successfully' });
    });
  }

  // @Get('allroles')
  // async getProfile(@ActiveUser() user: User) {
  //   return {
  //     message: 'this route every one that is authenticated can get to here ',
  //     data: {
  //       user: user,
  //     },
  //   };
  // }
  //
  // @Get('justCashier')
  // @Roles(Role.Cashier)
  // getProtected(@ActiveUser() user: User) {
  //   return {
  //     message: 'This is a protected route only Cashier can access it ',
  //     data: {
  //       user: user,
  //     },
  //   };
  // }
  //
  // @Public()
  // @Get()
  // getPublic() {
  //   return { message: 'This is a public route' };
  // }
}
