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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const uploads_service_1 = require("./uploads.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const fs = require("fs");
const path = require("path");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadAvatar(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const result = await this.uploadsService.uploadAvatar(file);
        return Object.assign({ message: 'Avatar uploaded successfully' }, result);
    }
    async uploadRequestImage(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const result = await this.uploadsService.uploadRequestImage(file);
        return Object.assign({ message: 'Image uploaded successfully' }, result);
    }
    async getFile(filename, res) {
        console.log(`🖼️ Image request for: ${filename}`);
        console.log(`🖼️ Request headers:`, JSON.stringify(res.req.headers, null, 2));
        try {
            const sanitizedFilename = path.basename(filename);
            if (sanitizedFilename !== filename) {
                throw new common_1.BadRequestException('Invalid filename');
            }
            const filePath = this.uploadsService.getFilePath(sanitizedFilename);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found' });
            }
            const ext = path.extname(sanitizedFilename).toLowerCase();
            let contentType = 'image/webp';
            switch (ext) {
                case '.jpg':
                case '.jpeg':
                    contentType = 'image/jpeg';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.webp':
                    contentType = 'image/webp';
                    break;
                case '.gif':
                    contentType = 'image/gif';
                    break;
            }
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }
        catch (error) {
            return res.status(400).json({ message: 'Invalid request' });
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Post)('request-image'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadRequestImage", null);
__decorate([
    (0, common_1.Get)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "getFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map