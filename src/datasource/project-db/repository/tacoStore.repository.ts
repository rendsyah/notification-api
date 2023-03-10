// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { TacoStore } from '../models/taco_store.entity';

@Injectable()
export class TacoStoreRepository extends BaseRepository<TacoStore> {
    constructor(@InjectRepository(TacoStore) private readonly tacoStoreModels: Repository<TacoStore>) {
        super(tacoStoreModels);
    }

    async findStoreAttachment(): Promise<TacoStore[]> {
        return this.tacoStoreModels
            .createQueryBuilder('tacoStore')
            .innerJoinAndSelect('tacoStore.tacoAttachment', 'tacoAttachment')
            .where('tacoStore.status = 2 AND tacoStore.is_push = 0')
            .getMany();
    }
}
