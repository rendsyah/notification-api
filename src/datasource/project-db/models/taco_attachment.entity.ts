// Import Modules
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Import Entity
import { ModelsBaseEntity } from './models_base.entity';
import { TacoStore } from './taco_store.entity';

@Entity()
export class TacoAttachment extends ModelsBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TacoStore, (tacoStore) => tacoStore.tacoAttachment)
    @JoinColumn({ name: 'store_id' })
    tacoStore: TacoStore;

    @Column({ type: 'text' })
    url: string;
}
