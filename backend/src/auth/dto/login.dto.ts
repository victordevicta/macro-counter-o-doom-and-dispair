import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'soul@doomvault.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'D00mP@ssw0rd!' })
  @IsString()
  @MinLength(8)
  password: string;
}
