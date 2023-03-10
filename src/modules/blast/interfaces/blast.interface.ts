// Import Modules
import FormData from 'form-data';

// Import Entity
import { TacoAttachment } from '@datasource/project-db/models/taco_attachment.entity';
import { TacoStore } from '@datasource/project-db/models/taco_store.entity';

// Define Header Params Interface
export interface HeaderParams {
    type: 'image';
    image: {
        link: string;
    };
}

// Define Body Params Interface
export interface BodyParams {
    type: 'text';
    text: string;
}

// Define Footer Params Interface
export interface FooterParams {
    type: 'text';
    text: string;
}

// Define Image Processing Data Interface
export interface ImageProcessingData {
    text: string;
    positionX: number;
    positionY: number;
}

// Define Image Processing Interface
export interface BlastProcessing {
    id: number;
    storeName: string;
    storeCode: string;
    hp: string;
    url: TacoAttachment[];
}

// Define Image Processing Interface
export interface ImageProcessing {
    store: TacoStore;
    storeName: ImageProcessingData;
    storeCode: ImageProcessingData;
    coupon: ImageProcessingData;
}

// Define Notification Sending Processing Queue Interface
export interface NotificationSendingProcessingQueue {
    to: string;
    namespace: string;
    name: string;
    headerParams?: HeaderParams[];
    bodyParams?: BodyParams[];
    footerParams?: FooterParams[];
}

// Define Image Upload Processing Queue Interface
export interface ImageUploadProcessingQueue {
    image: Buffer;
    filename: string;
}

// Define Image Processing Queue Interface
export interface ImageProcessingQueue {
    imageProcess: ImageProcessing;
}

export interface ImageResultProcessingQueue {
    url: string;
}
