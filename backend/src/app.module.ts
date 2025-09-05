import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SkillsModule } from './skills/skills.module';
import { RequestsModule } from './requests/requests.module';
import { ApplicationsModule } from './applications/applications.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window in milliseconds
      limit: 100, // Max requests per time window
    }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      playground: process.env.NODE_ENV !== 'production',
      introspection: true,
      formatError: (error) => {
        // Don't expose internal errors in production
        if (process.env.NODE_ENV === 'production') {
          if (error.message.includes('prisma') || error.message.includes('database')) {
            return new Error('Internal server error');
          }
        }
        return error;
      },
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    RequestsModule,
    ApplicationsModule,
    MessagesModule,
    ReviewsModule,
    ReportsModule,
    NotificationsModule,
    UploadsModule,
  ],
})
export class AppModule {}