import { Controller, Post, Body, Param, NotFoundException, Patch, Delete, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/middleware/roles.guard';
import { UserService } from './user.service';

import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Roles } from '../common/decorators/roles.decorator';
import { UserExistenceGuard } from './guards/user-existence.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(@Body() createUserDto: SignUpDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, UserExistenceGuard, RolesGuard)
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, UserExistenceGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    const deleteResponse = await this.userService.deleteUser(id);
    if (!deleteResponse) {
      throw new NotFoundException('User not found');
    }
    return deleteResponse;
  }
}
