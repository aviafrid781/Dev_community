import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateSkillsDto {
  @IsNotEmpty()
  readonly skillsName: string;
  @IsNotEmpty()
  readonly experience: number;
  @IsNotEmpty()
  readonly userId: string;
}
