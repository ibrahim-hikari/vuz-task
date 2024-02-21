import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthService } from '../auth/auth.service';

import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './interfaces/user.interface';
import { DeleteResponse } from '../shipments/interfaces/delete-response.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { SearchFilter } from './interfaces/search-filter.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) { }

  /**
   * Creates a new user.
   * @param {SignUpDto} createUserDto - The DTO containing user signup data.
   * @returns {Promise<LoginResponse>} A promise resolving to a login response.
  */
  async createUser(createUserDto: SignUpDto): Promise<LoginResponse> {
    return await this.authService.signup(createUserDto, false);
  }

  /**
   * Finds a user based on the provided search filter.
   * @param {SearchFilter} searchFilter - The search filter to use for finding the user.
   * @returns {Promise<User>} A promise resolving to the found user.
   * @throws {NotFoundException} Throws a NotFoundException if the user is not found.
  */
  async findUser(searchFilter: SearchFilter): Promise<User> {
    try {
      const user: User = await this.userModel.findOne(searchFilter).exec();
      if (!!user) {
        return user;
      }

      throw new NotFoundException('User not found');
    } catch (error) {
      console.error(error);

      throw new NotFoundException('User not found');
    }
  }

  /**
   * Updates a user with the provided ID and update data.
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the data to update the user with.
   * @returns {Promise<User>} A promise resolving to the updated user.
  */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateUserDto,
        modifiedDate: new Date(),
      },
      { new: true }
    ).exec();

    return user;
  }

  /**
   * Deletes a user with the provided ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<DeleteResponse>} A promise resolving to the delete response.
  */
  async deleteUser(id: string): Promise<DeleteResponse> {
    const deletedUser = await this.userModel.deleteOne({ _id: id }).exec();
    if (deletedUser.acknowledged) {
      return {
        status: 202,
        message: 'User deleted successfully'
      };
    }
  }
}
