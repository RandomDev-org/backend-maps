export class PointResponseDto {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  phone: string | null;
  capacity: number | null;
  type: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
