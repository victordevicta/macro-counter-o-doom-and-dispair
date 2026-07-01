import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchFoodDto {
  @ApiPropertyOptional()
  @IsString()
  query: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export class CreateCustomFoodDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsNumber()
  servingSize: number;

  @IsString()
  servingUnit: string;

  @IsOptional()
  @IsString()
  servingName?: string;

  @IsNumber()
  calories: number;

  @IsNumber()
  proteinG: number;

  @IsNumber()
  carbsG: number;

  @IsNumber()
  fatG: number;

  @IsOptional()
  @IsNumber()
  fiberG?: number;

  @IsOptional()
  @IsNumber()
  sodiumMg?: number;

  @IsOptional()
  @IsNumber()
  sugarG?: number;
}
