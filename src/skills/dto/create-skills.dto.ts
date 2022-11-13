import { IsNotEmpty } from 'class-validator';
export class CreateSkillsDto {
  @IsNotEmpty()
  readonly skillsName: string;
  @IsNotEmpty()
  readonly expertises: string;
  @IsNotEmpty()
  readonly userId: string;
}
