// src/entity/FormEntry.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FormEntry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    formId!: string;

    @Column('json') // Ensure 'json' is in quotes
    data!: object; // Use 'any' or a more specific type if known
}
