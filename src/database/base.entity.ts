import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn({ name: "created_on" })
    createdOn?: Date;

    @Column({ name: 'created_by', type: 'integer' })
    createdById?: number;

    @CreateDateColumn({ name: 'updated_on' })
    updatedOn?: Date;

    @Column({ name: 'updated_by', type: 'integer', nullable: true })
    updatedById?: number;

    @DeleteDateColumn()
    deletedOn?: Date;
}