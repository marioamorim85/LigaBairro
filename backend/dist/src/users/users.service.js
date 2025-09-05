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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
let UsersService = class UsersService {
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findByGoogleId(googleId) {
        return this.prisma.user.findUnique({
            where: { googleId },
        });
    }
    async create(input) {
        return this.prisma.user.create({
            data: input,
        });
    }
    async update(id, input) {
        return this.prisma.user.update({
            where: { id },
            data: input,
        });
    }
    async updateUserSkills(userId, skillIds) {
        await this.prisma.userSkill.deleteMany({
            where: { userId },
        });
        if (skillIds.length > 0) {
            await this.prisma.userSkill.createMany({
                data: skillIds.map(skillId => ({
                    userId,
                    skillId,
                })),
            });
        }
        return this.findById(userId);
    }
    async updateAvatar(userId, file) {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.avatarUrl) {
            const oldFilename = user.avatarUrl.split('/').pop();
            if (oldFilename) {
                await this.uploadsService.deleteImage(oldFilename);
            }
        }
        const { url } = await this.uploadsService.uploadAvatar(file);
        return this.update(userId, { avatarUrl: url });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], UsersService);
//# sourceMappingURL=users.service.js.map