// src/entity/FormEntry.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FormEntry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    formId!: string;

    @Column('json')
    data!: object;
}
