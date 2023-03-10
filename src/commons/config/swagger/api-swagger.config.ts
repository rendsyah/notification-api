// Import Modules
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

// Define Api Swagger Config
export const apiSwaggerConfig = async (app: INestApplication): Promise<OpenAPIObject> => {
    const document = new DocumentBuilder()
        .setTitle('Blast Notification API')
        .setDescription('Blast Notification API documentation')
        .setTermsOfService('http://example.com/terms')
        .setContact('Developer', 'http://www.example.com/support', 'example@gmail.com')
        .setVersion('1.0')
        .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')
        .addSecurity('authorization', { name: 'authorization', type: 'apiKey', in: 'header' })
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };

    return SwaggerModule.createDocument(app, document, options);
};
