// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { MasterAccess } from '../models/master_access.entity';

@Injectable()
export class AccessRepository extends BaseRepository<MasterAccess> {
    constructor(@InjectRepository(MasterAccess) private readonly accessModels: Repository<MasterAccess>) {
        super(accessModels);
    }
}
