import { IsNumber, Min, IsLatitude, IsLongitude } from 'class-validator';

export class QueryNearbyDto {
  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(1)
  radius: number;
}
