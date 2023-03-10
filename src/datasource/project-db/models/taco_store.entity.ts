// Import Modules
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Import Entity
import { ModelsBaseEntity } from './models_base.entity';
import { TacoAttachment } from './taco_attachment.entity';

@Entity()
export class TacoStore extends ModelsBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => TacoAttachment, (tacoAttachment) => tacoAttachment.tacoStore)
    tacoAttachment: TacoAttachment[];

    @Column({ type: 'varchar', length: 100 })
    store_name: string;

    @Column({ type: 'varchar', length: 100 })
    store_code: string;

    @Column({ type: 'varchar', length: 100, default: '' })
    coupon: string;

    @Column({ type: 'varchar', length: 50 })
    hp: string;

    @Column({ type: 'smallint', default: 0 })
    is_push: number;
}
