// Import Modules
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { Readable } from 'stream';
import * as Jimp from 'jimp';
import * as appRoot from 'app-root-path';
import * as FormData from 'form-data';
import axios from 'axios';

// Import Commons
import { HelperService } from '@commons/lib/helper/helper.service';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';

// Import Interfaces
import {
    ImageProcessingData,
    ImageProcessingQueue,
    ImageResultProcessingQueue,
    ImageUploadProcessingQueue,
    NotificationSendingProcessingQueue,
} from './interfaces/blast.interface';

@Processor('blast_notification_processing')
export class BlastNotificationProcessing {
    constructor(private readonly configService: ConfigService) {}

    @Process()
    async blastNotificationProcessing(job: Job<NotificationSendingProcessingQueue>): Promise<string> {
        const { to, namespace, name, headerParams, bodyParams, footerParams } = job.data;

        const getConfig = {
            headers: {
                'Qiscus-App-Id': this.configService.get('app.SERVICE_QISCUS_APP_ID'),
                'Qiscus-Secret-Key': this.configService.get('app.SERVICE_QISCUS_APP_SECRET_KEY'),
                'content-type': 'application/json',
            },
        };

        let getComponents = [];

        if (headerParams) {
            getComponents.push(
                {
                    type: 'header',
                    parameters: headerParams,
                },
                {
                    type: 'body',
                    parameters: [],
                },
            );
        }

        if (bodyParams) {
            getComponents.push({ type: 'body', parameters: bodyParams });
        }

        const getRequestSending = {
            to: to,
            type: 'template',
            template: {
                namespace: namespace,
                name: name,
                language: {
                    policy: 'deterministic',
                    code: 'id',
                },
                components: getComponents,
            },
        };

        await axios.post(this.configService.get('app.SERVICE_QISCUS_APP_MESSAGE_URL'), getRequestSending, getConfig);

        return 'notification success';
    }
}

@Processor('blast_image_processing')
export class BlastImageProcessing {
    private projectDbModels: IGetProjectDbModels;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperService: HelperService,
        private readonly projectDbService: ProjectDbService,
    ) {
        this.projectDbModels = this.projectDbService.getModels();
    }

    private async blastImageUploadProcessing(params: ImageUploadProcessingQueue): Promise<string> {
        const { image, filename } = params;

        const setFormData: FormData = new FormData();
        setFormData.append('file', Readable.from(image), { filename: filename });

        const getConfig = {
            headers: {
                qiscus_sdk_app_id: this.configService.get('app.SERVICE_QISCUS_APP_ID'),
                qiscus_sdk_token: this.configService.get('app.SERVICE_QISCUS_APP_UPLOAD_TOKEN'),
                ...setFormData.getHeaders(),
            },
        };

        const getResponse = await axios.post(this.configService.get('app.SERVICE_QISCUS_APP_UPLOAD_URL'), setFormData, getConfig);
        const getUrl: string = getResponse.data?.results?.file?.url;

        return getUrl;
    }

    @Process()
    async blastImageProcessing(job: Job<ImageProcessingQueue>): Promise<ImageResultProcessingQueue> {
        const { imageProcess } = job.data;

        const [getFontNameCode, getFontCoupon] = await Promise.all([
            Jimp.loadFont(Jimp.FONT_SANS_64_BLACK),
            Jimp.loadFont(`${appRoot}/assets/template/font/test.fnt`),
        ]);

        const imageProcessing = await Jimp.read(`${appRoot}/assets/template/template-taco.jpg`);
        const getImageProcessingData: ImageProcessingData[] = Object.values(imageProcess);
        for (let idx = 1; idx < getImageProcessingData.length; idx++) {
            const getPositionX = getImageProcessingData[idx].positionX;
            const getPositionY = getImageProcessingData[idx].positionY;
            const getTextImage = getImageProcessingData[idx].text;

            const getText = idx < getImageProcessingData.length - 1 ? getTextImage : this.helperService.validateTextSpace(getTextImage);
            const getFont = idx < getImageProcessingData.length - 1 ? getFontNameCode : getFontCoupon;
            imageProcessing.print(getFont, getPositionX, getPositionY, getText);
        }
        const getCurrentDate = this.helperService.validateTime(new Date(), 'dateformat');
        const getRandChar = this.helperService.validateRandomChar(8, 'alphanumeric');
        const getExt = imageProcessing.getExtension();
        const getFilename = `${getCurrentDate}_${getRandChar}.${getExt}`;
        const getBufferImage = await imageProcessing.getBufferAsync(imageProcessing._originalMime);

        // Set Save Image For Testing
        // await Promise.all([
        //     imageProcessing.writeAsync(`${appRoot}/..${this.configService.get('app.SERVICE_UPLOAD_PATH')}/${getFilename}`),
        //     this.projectDbModels.TacoAttachmentModels.create({ tacoStore: imageProcess.store, url: getFilename }),
        // ]);
        // return { url: getFilename };

        const getUrl = await this.blastImageUploadProcessing({ image: getBufferImage, filename: getFilename });
        await this.projectDbModels.TacoAttachmentModels.create({ tacoStore: imageProcess.store, url: getUrl });

        return { url: getUrl };
    }
}
