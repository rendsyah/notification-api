// Import All Repository
import { AccessRepository, TacoAttachmentRepository, TacoStoreRepository, UsersRepository } from '@datasource/project-db/repository';

// Define Project DB Models Interfaces
export interface IGetProjectDbModels {
    AccessModels: AccessRepository;
    TacoAttachmentModels: TacoAttachmentRepository;
    TacoStoreModels: TacoStoreRepository;
    UsersModels: UsersRepository;
}
