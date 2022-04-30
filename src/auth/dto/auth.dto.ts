import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class PayloadTokenDTO {
  id: string;
  email: string;
  name: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export class ResponseTokenDTO {
  access_token: string;
}
