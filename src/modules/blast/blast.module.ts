// Import Modules
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

// Import Datasource
import { ProjectDbModule } from '@datasource/project-db/project-db.module';

// Import Service
import { BlastController } from './blast.controller';
import { BlastService } from './blast.service';

// Import Processor
import { BlastImageProcessing, BlastNotificationProcessing } from './blast.processor';

@Module({
    imports: [
        ProjectDbModule,
        BullModule.registerQueueAsync({ name: 'blast_notification_processing' }, { name: 'blast_image_processing' }),
    ],
    controllers: [BlastController],
    providers: [BlastService, BlastNotificationProcessing, BlastImageProcessing],
})
export class BlastModule {}
