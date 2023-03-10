// Import Modules
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';

// Define Setup Bull Dashboard
export const apiSetupQueues = async (app: INestApplication, queue: string[]): Promise<ExpressAdapter> => {
    const bullAdapter = [];

    for (let index = 0; index < queue.length; index++) {
        bullAdapter.push(new BullAdapter(app.get(`BullQueue_${queue[index]}`)));
    }

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({ queues: bullAdapter, serverAdapter });

    return serverAdapter;
};
