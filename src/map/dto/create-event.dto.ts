import {
  IsString, IsOptional, IsUUID, IsBoolean, IsNumber, IsArray, IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  pointId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  musicGenre?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  artists?: string[];

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  ticketPrice?: number;

  @IsOptional()
  @IsNumber()
  availableCapacity?: number;

  @IsOptional()
  @IsString()
  poster?: string;
}
