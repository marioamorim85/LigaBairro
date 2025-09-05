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
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let UploadsService = UploadsService_1 = class UploadsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(UploadsService_1.name);
        this.maxFileSize = 5 * 1024 * 1024;
        this.allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        this.uploadDir = path.join(process.cwd(), 'uploads');
        this.ensureUploadDir();
    }
    ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Created upload directory: ${this.uploadDir}`);
        }
    }
    async uploadImage(file, options = {}) {
        this.validateFile(file);
        const { width = 800, height = 800, quality = 85 } = options;
        const filename = `${(0, uuid_1.v4)()}.webp`;
        const filePath = path.join(this.uploadDir, filename);
        try {
            await sharp(file.buffer)
                .resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .webp({ quality })
                .toFile(filePath);
            const baseUrl = this.configService.get('BACKEND_URL') || 'http://localhost:4000';
            const url = `${baseUrl}/uploads/${filename}`;
            this.logger.log(`Image uploaded successfully: ${filename}`);
            return { url, filename };
        }
        catch (error) {
            this.logger.error(`Failed to process image: ${error.message}`);
            throw new common_1.BadRequestException('Failed to process image');
        }
    }
    async uploadAvatar(file) {
        return this.uploadImage(file, {
            width: 200,
            height: 200,
            quality: 90,
        });
    }
    async uploadRequestImage(file) {
        return this.uploadImage(file, {
            width: 800,
            height: 600,
            quality: 85,
        });
    }
    async deleteImage(filename) {
        if (!filename)
            return;
        try {
            const filePath = path.join(this.uploadDir, path.basename(filename));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                this.logger.log(`Deleted image: ${filename}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to delete image ${filename}: ${error.message}`);
        }
    }
    validateFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`);
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
    }
    getFilePath(filename) {
        return path.join(this.uploadDir, path.basename(filename));
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map