// Import Modules
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import { logger } from 'express-winston';
import helmet from 'helmet';

// Import Commons
import { apiLogger } from '@commons/logger';
import { apiSwaggerConfig } from '@commons/config/swagger/api-swagger.config';
import { apiSetupQueues } from '@commons/config/databases/redis/bull.setup';

// Import App Modules
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const SERVICE_PORT = configService.get('app.SERVICE_PORT');
    const SERVICE_PREFIX = configService.get('app.SERVICE_PREFIX');
    const SERVICE_DOCS = configService.get('app.SERVICE_DOCS');

    const setupQueues = await apiSetupQueues(app, ['blast_notification_processing', 'blast_image_processing']);

    app.enableCors();
    app.use(json());
    app.use(helmet());
    app.use('/admin/queues', setupQueues.getRouter());
    app.use(logger(apiLogger));

    app.setGlobalPrefix(SERVICE_PREFIX);

    if (SERVICE_DOCS) {
        const swaggerConfig = await apiSwaggerConfig(app);
        SwaggerModule.setup('/api/docs', app, swaggerConfig);
    }

    await app.listen(SERVICE_PORT, () => {
        new Logger('Bootstrap').log(`Service Running on Port ${SERVICE_PORT}`);
    });
}
bootstrap();
