import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FormTypes {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    formType!: string;

    @Column()
    formPosition!: string;

    @Column()
    formName!: string;

    @Column({ nullable: true })
    formValueType?: string;

    @Column({ default: 'true' })
    formTypeEnabled!: boolean;
}