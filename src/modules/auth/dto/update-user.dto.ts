import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: string;

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
