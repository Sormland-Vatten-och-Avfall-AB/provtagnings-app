import { Entity, Column, PrimaryColumn, Check } from 'typeorm';

@Entity({ name: 'typed_entries' })
export class TypedEntries {
  @PrimaryColumn({ 
    type: 'smallint', 
    name: 'type_id' 
  })
  @Check('type_id >= 0 AND type_id <= 255')
  typeId!: number;

  @PrimaryColumn({ 
    type: 'integer', 
    name: 'unique_id' 
  })
  @Check('unique_id >= 0 AND unique_id <= 65535')
  uniqueId!: number;

  @Column({ 
    type: 'json',
    name: 'form_data'
  })
  data!: object;

  @Column({
    type: 'boolean',
    name: 'form_complete'
  })
  formComplete!: boolean;
}