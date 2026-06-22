export interface SpatialPoint {
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
  distance?: number;
  musicGenres: string[];
  createdAt: Date;
  updatedAt: Date;
}
