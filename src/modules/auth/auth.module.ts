import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './models/user.model';
import { MailService } from './mail.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [
    AuthService,
    MailService,
    UserService,
  ],
  controllers: [
    UserController,
    AuthController
  ],
  exports: [AuthService]
})
export class AuthModule { }
