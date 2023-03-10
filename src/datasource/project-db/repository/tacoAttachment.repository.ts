// Import Modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import Base Repository
import { BaseRepository } from './base.repository';

// Import Entity
import { TacoAttachment } from '../models/taco_attachment.entity';

@Injectable()
export class TacoAttachmentRepository extends BaseRepository<TacoAttachment> {
    constructor(@InjectRepository(TacoAttachment) private readonly tacoAttachmentModels: Repository<TacoAttachment>) {
        super(tacoAttachmentModels);
    }
}
