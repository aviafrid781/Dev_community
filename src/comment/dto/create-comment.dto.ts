import {  IsNotEmpty } from 'class-validator';
export class CreateCommentDto {
    @IsNotEmpty()
    readonly comment: string;
    @IsNotEmpty()
    readonly postId: string;
    @IsNotEmpty()
    readonly userId: string;
  

}
