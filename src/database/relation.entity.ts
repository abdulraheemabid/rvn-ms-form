import { ChildRelationType } from "src/utils/constants.utils";
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

/**
 * This table is used to manage forms relationships.
 * 
 * This table is set to use type-orm's closure table feature to handle hierarchy.
 * 
 * Type-orm will only provide us direct access with primary table which is this entity. But will not give access to 
 * the closure table. Ideally we should not have to access  the clousure table directly as typeorm should abstract and handle underlying
 * logic of maintaining heirarichal data.
 */
@Entity({ name: "relation" })
@Tree("closure-table")
export class RelationEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    formId: number;

    /**
     * This has not yet been implemented
     * @example many-to-one, one-one
     */
    @Column({ name: "relation_type", nullable: true })
    relationType: ChildRelationType;

    /**
     * typeorm will auto populate record's children
     */
    @TreeChildren()
    children: RelationEntity[];

    /**
     * typeorm will auto populate record's parent
     */
    @TreeParent()
    parent: RelationEntity;
}