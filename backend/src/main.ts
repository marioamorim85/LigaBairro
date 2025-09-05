import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  }));
  
  // Performance
  app.use(compression());
  
  // Request parsing
  app.use(cookieParser());
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({
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
  
  // Global filters - removed HttpExceptionFilter to avoid GraphQL conflicts
  
  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // CORS
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

  // Graceful shutdown
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