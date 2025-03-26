import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['à faire', 'en cours', 'terminée'])
  @IsOptional()
  status?: string;
}
