import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GeoPoint {
  lat: number;
  lng: number;
}

@Injectable()
export class GeoService {
  private readonly MOZELOS_CENTER_LAT: number;
  private readonly MOZELOS_CENTER_LNG: number;
  private readonly MOZELOS_RADIUS_KM: number;
  private readonly MOZELOS_CITY = 'Mozelos';

  // Limites aproximados de Mozelos para validação mais rigorosa
  private readonly MOZELOS_BOUNDS = {
    north: 40.9850,   // Latitude máxima
    south: 40.9620,   // Latitude mínima  
    east: -8.5350,    // Longitude máxima (menos negativa)
    west: -8.5610,    // Longitude mínima (mais negativa)
  };

  constructor(private configService: ConfigService) {
    // Coordenadas mais precisas do centro de Mozelos
    this.MOZELOS_CENTER_LAT = Number(configService.get('MOZELOS_CENTER_LAT', 40.9735));
    this.MOZELOS_CENTER_LNG = Number(configService.get('MOZELOS_CENTER_LNG', -8.5480));
    this.MOZELOS_RADIUS_KM = Number(configService.get('MOZELOS_RADIUS_KM', 7)); // Sincronizado com frontend
  }

  // Calculate distance using Haversine formula
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Validate if coordinates are within Portugal bounds (basic sanity check)
  private isWithinPortugalBounds(lat: number, lng: number): boolean {
    // Portugal bounds (approximate)
    const portugalBounds = {
      north: 42.15,    // Minho
      south: 36.95,    // Algarve  
      east: -6.18,     // Beira
      west: -9.50,     // Azores/Madeira excluded for simplicity
    };

    return lat >= portugalBounds.south && lat <= portugalBounds.north &&
           lng >= portugalBounds.west && lng <= portugalBounds.east;
  }

  // Validate if location is within Mozelos bounds
  private isWithinMozelosBounds(lat: number, lng: number): boolean {
    return lat >= this.MOZELOS_BOUNDS.south && lat <= this.MOZELOS_BOUNDS.north &&
           lng >= this.MOZELOS_BOUNDS.west && lng <= this.MOZELOS_BOUNDS.east;
  }

  // Enhanced validation for Mozelos location
  validateMozelosLocation(lat: number, lng: number, city: string): void {
    // Basic validation
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Coordenadas inválidas');
    }

    // Check if coordinates are reasonable (within Portugal)
    if (!this.isWithinPortugalBounds(lat, lng)) {
      throw new BadRequestException('Coordenadas fora de Portugal');
    }

    // Force city to be Mozelos in MVP
    if (city !== this.MOZELOS_CITY) {
      throw new BadRequestException(`Apenas pedidos em ${this.MOZELOS_CITY} são aceites no MVP`);
    }

    // Primary validation: distance check (circular area matching frontend map)
    const distance = this.calculateDistance(
      this.MOZELOS_CENTER_LAT,
      this.MOZELOS_CENTER_LNG,
      lat,
      lng
    );

    if (distance > this.MOZELOS_RADIUS_KM) {
      throw new BadRequestException(
        `Localização fora dos limites de ${this.MOZELOS_CITY}. Por favor, seleciona uma localização dentro do raio azul no mapa (${distance.toFixed(2)}km do centro, máximo: ${this.MOZELOS_RADIUS_KM}km)`
      );
    }
  }

  // Get Haversine SQL for distance calculations
  getHaversineSql(userLat: number, userLng: number): string {
    return `
      6371 * acos(
        cos(radians(${userLat})) * cos(radians(lat)) * cos(radians(lng) - radians(${userLng})) +
        sin(radians(${userLat})) * sin(radians(lat))
      )
    `;
  }

  // Get operational constraints
  getOperationalConstraints() {
    return {
      centerLat: this.MOZELOS_CENTER_LAT,
      centerLng: this.MOZELOS_CENTER_LNG,
      radiusKm: this.MOZELOS_RADIUS_KM,
      city: this.MOZELOS_CITY,
    };
  }
}