// Import Modules
import { Injectable } from '@nestjs/common';

// Import Repository
import { AccessRepository, TacoAttachmentRepository, TacoStoreRepository, UsersRepository } from './repository';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';

@Injectable()
export class ProjectDbService {
    constructor(
        private readonly accessRepository: AccessRepository,
        private readonly tacoAttachmentRepository: TacoAttachmentRepository,
        private readonly tacoStoreRepository: TacoStoreRepository,
        private readonly usersRepository: UsersRepository,
    ) {}

    getModels(): IGetProjectDbModels {
        return {
            AccessModels: this.accessRepository,
            TacoAttachmentModels: this.tacoAttachmentRepository,
            TacoStoreModels: this.tacoStoreRepository,
            UsersModels: this.usersRepository,
        };
    }
}
