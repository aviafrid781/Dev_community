import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  readonly fname: string;
  @IsNotEmpty()
  readonly lname: string;
  @IsNotEmpty()
  readonly password: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly address: string;
  @IsNotEmpty()
  readonly userType: string;
}
