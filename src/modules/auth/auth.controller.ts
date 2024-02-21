
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<LoginResponse> {
    return await this.authService.login(signInDto);
  }

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<LoginResponse> {
    return await this.authService.signup(signUpDto, true);
  }
}
