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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const prisma_service_1 = require("../common/prisma/prisma.service");
let HealthController = class HealthController {
    constructor(health, prisma, memory, disk, prismaService) {
        this.health = health;
        this.prisma = prisma;
        this.memory = memory;
        this.disk = disk;
        this.prismaService = prismaService;
    }
    check() {
        return this.health.check([
            () => this.prisma.pingCheck('database', this.prismaService),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
            () => this.disk.checkStorage('storage', {
                path: process.platform === 'win32' ? 'C:\\' : '/',
                thresholdPercent: 0.9,
            }),
        ]);
    }
    live() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'ligabairro-backend',
            version: '1.0.0',
        };
    }
    async ready() {
        try {
            await this.prismaService.$queryRaw `SELECT 1`;
            return {
                status: 'ready',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'not ready',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
__decorate([
    (0, common_1.Get)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.PrismaHealthIndicator,
        terminus_1.MemoryHealthIndicator,
        terminus_1.DiskHealthIndicator,
        prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map