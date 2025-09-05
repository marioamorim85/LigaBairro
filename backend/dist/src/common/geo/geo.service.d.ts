import { ConfigService } from '@nestjs/config';
export declare class GeoService {
    private configService;
    private readonly FIAES_CENTER_LAT;
    private readonly FIAES_CENTER_LNG;
    private readonly FIAES_RADIUS_KM;
    private readonly FIAES_CITY;
    private readonly FIAES_BOUNDS;
    constructor(configService: ConfigService);
    calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
    private toRadians;
    private isWithinPortugalBounds;
    private isWithinFiaesBounds;
    validateFiaesLocation(lat: number, lng: number, city: string): void;
    getHaversineSql(userLat: number, userLng: number): string;
    getOperationalConstraints(): {
        centerLat: number;
        centerLng: number;
        radiusKm: number;
        city: string;
    };
}
