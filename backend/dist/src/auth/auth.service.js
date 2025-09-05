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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(jwtService, configService, usersService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.usersService = usersService;
    }
    async validateGoogleUser(profile) {
        const existingUser = await this.usersService.findByGoogleId(profile.id);
        if (existingUser) {
            return this.usersService.update(existingUser.id, {
                name: profile.name,
                avatarUrl: profile.picture,
            });
        }
        return this.usersService.create({
            name: profile.name,
            email: profile.email,
            googleId: profile.id,
            avatarUrl: profile.picture,
            city: 'Fiães',
        });
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    getCookieOptions() {
        return {
            httpOnly: true,
            secure: this.configService.get('COOKIE_SECURE') === 'true',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: this.configService.get('COOKIE_DOMAIN'),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map