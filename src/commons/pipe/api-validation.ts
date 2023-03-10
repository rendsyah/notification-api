// Import Modules
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

// Import Logger Service
import { apiLoggerService } from '@commons/logger';

// Import Exceptions
import { ApiBadRequestException } from '@commons/exception/api-exception';

export abstract class ApiValidationPipe implements PipeTransform {
    constructor() {}

    public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
        try {
            await this.buildSchema().validateAsync(value, { abortEarly: false });
            return value;
        } catch (error) {
            const message = error.message.replace(/\"/g, '');
            const params = error.details?.[0]?.path ?? [''];

            apiLoggerService.error(`${error}`, { service: 'validation' });

            throw new ApiBadRequestException(params, message);
        }
    }

    public abstract buildSchema(): Joi.Schema;
}
