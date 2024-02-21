import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { User } from './interfaces/user.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { MailService } from './mail.service'; // Import MailService
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';


@Injectable()
export class AuthService {
  SECRET = process.env.JWT_SECRET;
  MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private mailService: MailService,
  ) { }

  /**
   * Sign up a new user with the provided authentication data.
   * @param {SignUpDto} body - The authentication data for the new user.
   * @returns {Promise<LoginResponse>} - A promise that resolves to a LoginResponse object containing the status, message, and data.
  */
  signup = async (body: SignUpDto, isTokenNeeded: boolean): Promise<LoginResponse> => {
    try {
      const hashedPassword: string = await hash(body.password, 10);
      body.password = hashedPassword;
      const result = (await this.userModel.create(body)).toObject();
      const token: string =  this.generateToken(result, isTokenNeeded);

      // Send welcome email to the user
      await this.sendWelcomeEmail(result.email, result.fullName);

      return {
        status: 201,
        message: 'User created',
        data: {
          user: result,
          token,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          status: 410,
          message: 'Email already exists',
          data: null,
        };
      }
      console.error(error);

      return error;
    }
  };

  /**
   * Log in a user with the given email and password.
   * @param {SignInDto} signInDto - The authentication data of the user attempting to log in.
   * @returns {Promise<LoginResponse>} - A promise that resolves to a LoginResponse object containing the status, message, and data.
  */
  login = async (signInDto: SignInDto): Promise<LoginResponse> => {
    let result = await this.userModel.findOne({ email: signInDto.email, status: 'active' }, { __v: 0 });
    if (!result) {
      return {
        status: 404,
        message: 'User not found',
        data: null,
      };
    }

    result = result.toObject();
    const isPasswordMatch = await compare(signInDto.password, result.password);
    if (!isPasswordMatch) {
      return {
        status: 401,
        message: 'Invalid password',
        data: null,
      };
    }
    const token = this.generateToken(result, true);

    return {
      status: 200,
      message: 'Login successful',
      data: {
        user: result,
        token,
      },
    };
  };

  /**
   * Generate a JWT token for the given user.
   * @param {User} user - The user object from which to generate the token.
   * @returns {string} - The JWT token generated for the user.
  */
  generateToken = (user: User, isTokenNeeded: boolean): string => {
    delete user.password;
    return isTokenNeeded ? sign(user, this.SECRET, { expiresIn: '24h' }) : '';
  };

  /**
   * Sends a welcome email to the specified email address with the provided full name.
   * @param {string} email - The email address of the recipient.
   * @param {string} fullName - The full name of the recipient.
   * @returns {Promise<void>} A promise that resolves when the email is successfully sent or rejects with an error.
  */
  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    try {
      await this.mailService.sendEmail(
        'VUZ task <ajarmeh1997@gmail.com>',
        email, // Since this is a free Mailgun account, the email will only be sent to authorized recipients
        'Welcome to Our App',
        `Hi ${fullName}, Welcome to Our App!`,
        `<p>Hi ${fullName},</p><p>Welcome to Our App!</p>`,
      );
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }
}
