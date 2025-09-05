"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsModule = void 0;
const common_1 = require("@nestjs/common");
const requests_service_1 = require("./requests.service");
const requests_resolver_1 = require("./requests.resolver");
const geo_service_1 = require("../common/geo/geo.service");
const notifications_module_1 = require("../notifications/notifications.module");
let RequestsModule = class RequestsModule {
};
exports.RequestsModule = RequestsModule;
exports.RequestsModule = RequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        providers: [requests_service_1.RequestsService, requests_resolver_1.RequestsResolver, geo_service_1.GeoService],
        exports: [requests_service_1.RequestsService],
    })
], RequestsModule);
//# sourceMappingURL=requests.module.js.map