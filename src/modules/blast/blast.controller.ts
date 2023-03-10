// Import Modules
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Import Commons
import { ApiGetServiceDocs } from '@commons/config/swagger/api-swagger.docs';

// Import Service
import { BlastService } from './blast.service';

@ApiTags('Blast')
@Controller('blast')
export class BlastController {
    constructor(private readonly blastService: BlastService) {}

    @Get('whatsapp')
    @ApiGetServiceDocs('blast whatsapp')
    async blastNotificationWhatsappController(): Promise<string> {
        return await this.blastService.blastNotificationWhatsapp();
    }

    @Get('image/processing')
    @ApiGetServiceDocs('image processing')
    async blastImageProcessingController(): Promise<string> {
        return await this.blastService.blastImageProcessing();
    }
}
