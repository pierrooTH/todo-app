import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['à faire', 'en cours', 'terminée'])
  @IsOptional()
  status?: string;
}
