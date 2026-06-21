import { IsNumber, IsLatitude, IsLongitude } from 'class-validator';

export class QueryBoundsDto {
  @IsNumber()
  @IsLatitude()
  neLat: number;

  @IsNumber()
  @IsLongitude()
  neLng: number;

  @IsNumber()
  @IsLatitude()
  swLat: number;

  @IsNumber()
  @IsLongitude()
  swLng: number;
}
