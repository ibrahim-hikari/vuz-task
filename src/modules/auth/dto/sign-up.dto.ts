import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEnum(['admin', 'user'])
  role: string;
}
