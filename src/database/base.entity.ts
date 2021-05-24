import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Defines columns which will be added to each table which inherits BaseEntity
*/
export abstract class BaseEntity {
     /**
     * This column will be populated by typeorm
     */
    @PrimaryGeneratedColumn()
    id?: number;

     /**
     * This column will be populated by typeorm
     */
    @CreateDateColumn({ name: "created_on" })
    createdOn?: Date;

    /**
    * This column will have to be populated manually
    */
    @Column({ name: 'created_by', type: 'integer' })
    createdById?: number;

     /**
     * This column will be populated by typeorm
     */
    @CreateDateColumn({ name: 'updated_on' })
    updatedOn?: Date;

    /**
    * This column will have to be populated manually
    */
    @Column({ name: 'updated_by', type: 'integer', nullable: true })
    updatedById?: number;

     /**
     * This column will be populated by typeorm
     */
    @DeleteDateColumn()
    deletedOn?: Date;
}