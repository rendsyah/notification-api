// Import Modules
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

// Import Commons
import { ApiNotFoundException } from '@commons/exception/api-exception';

// Import Datasource
import { ProjectDbService } from '@datasource/project-db/project-db.service';

// Import Interfaces
import { IGetProjectDbModels } from '@datasource/interfaces/project-db.interface';
import { BlastProcessing, BodyParams, HeaderParams, ImageProcessing } from './interfaces/blast.interface';

@Injectable()
export class BlastService {
    private projectDbModels: IGetProjectDbModels;

    constructor(
        private readonly configService: ConfigService,
        private readonly projectDbService: ProjectDbService,
        @InjectQueue('blast_image_processing') private readonly blastImageProcessingQueue: Queue,
        @InjectQueue('blast_notification_processing') private readonly blastNotificationProcessingQueue: Queue,
    ) {
        this.projectDbModels = this.projectDbService.getModels();
    }

    private async _blastProcessing(params: BlastProcessing[]): Promise<void> {
        const getTemplateName = [
            this.configService.get('app.SERVICE_QISCUS_APP_TEMPLATE_NAME_BUBBLE_1'),
            this.configService.get('app.SERVICE_QISCUS_APP_TEMPLATE_NAME_BUBBLE_2'),
        ];
        for (let index = 0; index < params.length; index++) {
            const getId = params[index].id;
            const storeName = params[index].storeName;
            const storeCode = params[index].storeCode;
            const getHp = params[index].hp;
            const getUrl = params[index].url;

            const getParameters = {
                storeName: storeName,
                storeCode: storeCode,
                hp: getHp,
            };

            await this.projectDbModels.TacoStoreModels.update({ id: getId }, { is_push: 1 });

            const getHeaderParams: HeaderParams[] = [];
            const getBodyParams: BodyParams[] = [];

            getUrl.forEach((value) => {
                getHeaderParams.push({
                    type: 'image',
                    image: {
                        link: value.url,
                    },
                });
            });

            Object.values(getParameters).forEach((value) =>
                getBodyParams.push({
                    type: 'text',
                    text: value,
                }),
            );

            for (let idx = 0; idx < getTemplateName.length; idx++) {
                if (idx === 0) {
                    const getRequestSending = {
                        to: getHp,
                        namespace: this.configService.get('app.SERVICE_QISCUS_APP_TEMPLATE_NAMESPACE'),
                        name: getTemplateName[idx],
                        bodyParams: getBodyParams,
                    };
                    await this.blastNotificationProcessingQueue.add(getRequestSending);
                }
                if (idx !== 0) {
                    for (let ids = 0; ids < getUrl.length; ids++) {
                        const getRequestSending = {
                            to: getHp,
                            namespace: this.configService.get('app.SERVICE_QISCUS_APP_TEMPLATE_NAMESPACE'),
                            name: getTemplateName[idx],
                            headerParams: [getHeaderParams[ids]],
                            bodyParams: [],
                        };
                        await this.blastNotificationProcessingQueue.add(getRequestSending);
                    }
                }
            }
        }
    }

    async blastNotificationWhatsapp(): Promise<string> {
        const getBlastNotification = await this.projectDbModels.TacoStoreModels.findStoreAttachment();

        if (getBlastNotification.length === 0) {
            throw new ApiNotFoundException(['data'], 'data not found');
        }

        const setProcessing: BlastProcessing[] = getBlastNotification.map((value) => {
            return {
                id: value.id,
                storeName: value.store_name,
                storeCode: value.store_code,
                hp: value.hp,
                url: value.tacoAttachment,
            };
        });
        await this._blastProcessing(setProcessing);

        return 'blast on process';
    }

    async blastImageProcessing(): Promise<string> {
        const getImageProcessing = await this.projectDbModels.TacoStoreModels.find({ where: { status: 1, is_push: 0 } });

        if (getImageProcessing.length === 0) {
            throw new ApiNotFoundException(['data'], 'data not found');
        }

        for (let index = 0; index < getImageProcessing.length; index++) {
            const getStoreName = getImageProcessing[index].store_name;
            const getStoreCode = getImageProcessing[index].store_code;
            const getCoupon = getImageProcessing[index].coupon;
            const getSplitCoupon = getCoupon.split(',');

            let setImageProcessing: ImageProcessing = {
                store: getImageProcessing[index],
                storeName: {
                    positionX: 410,
                    positionY: 710,
                    text: getStoreName,
                },
                storeCode: {
                    positionX: 410,
                    positionY: 820,
                    text: getStoreCode,
                },
                coupon: {
                    positionX: 850,
                    positionY: 425,
                    text: '',
                },
            };

            if (getSplitCoupon.length === 1) {
                setImageProcessing.coupon.text = getCoupon;
                await this.blastImageProcessingQueue.add({ imageProcess: setImageProcessing });
            }
            if (getSplitCoupon.length !== 1) {
                for (let index = 0; index < getSplitCoupon.length; index++) {
                    setImageProcessing.coupon.text = getSplitCoupon[index];
                    await this.blastImageProcessingQueue.add({ imageProcess: setImageProcessing });
                }
            }
            await this.projectDbModels.TacoStoreModels.update({ id: getImageProcessing[index].id }, { status: 2 });
        }

        return 'upload on process';
    }
}
