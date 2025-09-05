"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GeoService = class GeoService {
    constructor(configService) {
        this.configService = configService;
        this.FIAES_CITY = 'Fiães';
        this.FIAES_BOUNDS = {
            north: 40.9850,
            south: 40.9620,
            east: -8.5350,
            west: -8.5610,
        };
        this.FIAES_CENTER_LAT = Number(configService.get('FIAES_CENTER_LAT', 40.9735));
        this.FIAES_CENTER_LNG = Number(configService.get('FIAES_CENTER_LNG', -8.5480));
        this.FIAES_RADIUS_KM = Number(configService.get('FIAES_RADIUS_KM', 7));
    }
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    isWithinPortugalBounds(lat, lng) {
        const portugalBounds = {
            north: 42.15,
            south: 36.95,
            east: -6.18,
            west: -9.50,
        };
        return lat >= portugalBounds.south && lat <= portugalBounds.north &&
            lng >= portugalBounds.west && lng <= portugalBounds.east;
    }
    isWithinFiaesBounds(lat, lng) {
        return lat >= this.FIAES_BOUNDS.south && lat <= this.FIAES_BOUNDS.north &&
            lng >= this.FIAES_BOUNDS.west && lng <= this.FIAES_BOUNDS.east;
    }
    validateFiaesLocation(lat, lng, city) {
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            throw new common_1.BadRequestException('Coordenadas inválidas');
        }
        if (!this.isWithinPortugalBounds(lat, lng)) {
            throw new common_1.BadRequestException('Coordenadas fora de Portugal');
        }
        if (city !== this.FIAES_CITY) {
            throw new common_1.BadRequestException(`Apenas pedidos em ${this.FIAES_CITY} são aceites no MVP`);
        }
        const distance = this.calculateDistance(this.FIAES_CENTER_LAT, this.FIAES_CENTER_LNG, lat, lng);
        if (distance > this.FIAES_RADIUS_KM) {
            throw new common_1.BadRequestException(`Localização fora dos limites de ${this.FIAES_CITY}. Por favor, seleciona uma localização dentro do raio azul no mapa (${distance.toFixed(2)}km do centro, máximo: ${this.FIAES_RADIUS_KM}km)`);
        }
    }
    getHaversineSql(userLat, userLng) {
        return `
      6371 * acos(
        cos(radians(${userLat})) * cos(radians(lat)) * cos(radians(lng) - radians(${userLng})) +
        sin(radians(${userLat})) * sin(radians(lat))
      )
    `;
    }
    getOperationalConstraints() {
        return {
            centerLat: this.FIAES_CENTER_LAT,
            centerLng: this.FIAES_CENTER_LNG,
            radiusKm: this.FIAES_RADIUS_KM,
            city: this.FIAES_CITY,
        };
    }
};
exports.GeoService = GeoService;
exports.GeoService = GeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeoService);
//# sourceMappingURL=geo.service.js.map