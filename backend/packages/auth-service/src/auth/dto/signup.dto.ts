import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { sanitize } from 'isomorphic-dompurify';
import { Transform } from 'class-transformer';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitize(value))
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
