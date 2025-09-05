"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    app.use(compression());
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            console.log('=== VALIDATION ERRORS ===');
            console.log('Validation errors:', JSON.stringify(errors, null, 2));
            return new Error(`Validation failed: ${JSON.stringify(errors)}`);
        },
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL
            : [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'http://localhost:3001',
                process.env.FRONTEND_URL,
            ].filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Cache-Control',
        ],
    });
    app.enableShutdownHooks();
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Backend running on port ${port}`);
    logger.log(`📊 Health check available at http://localhost:${port}/health`);
    logger.log(`🎯 GraphQL Playground available at http://localhost:${port}/graphql`);
}
bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map