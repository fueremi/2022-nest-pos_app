import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
