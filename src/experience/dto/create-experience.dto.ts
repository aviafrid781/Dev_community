import {IsNotEmpty } from 'class-validator';
export class CreateExperienceDto {
  
    @IsNotEmpty()
    readonly companyName: string;
    @IsNotEmpty()
    readonly totalYear: number;
    @IsNotEmpty()
    readonly stackName: string;
    @IsNotEmpty()
    readonly userId: string;
    
}
