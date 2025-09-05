"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const applications_service_1 = require("./applications.service");
const applications_resolver_1 = require("./applications.resolver");
const requests_module_1 = require("../requests/requests.module");
const messages_module_1 = require("../messages/messages.module");
const notifications_module_1 = require("../notifications/notifications.module");
let ApplicationsModule = class ApplicationsModule {
};
exports.ApplicationsModule = ApplicationsModule;
exports.ApplicationsModule = ApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            requests_module_1.RequestsModule,
            (0, common_1.forwardRef)(() => messages_module_1.MessagesModule),
            notifications_module_1.NotificationsModule,
        ],
        providers: [applications_service_1.ApplicationsService, applications_resolver_1.ApplicationsResolver],
        exports: [applications_service_1.ApplicationsService],
    })
], ApplicationsModule);
//# sourceMappingURL=applications.module.js.map