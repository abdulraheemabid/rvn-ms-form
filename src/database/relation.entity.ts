import { ChildRelationType } from "src/utils/constants.utils";
import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, TreeLevelColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({ name: "relation" })
@Tree("closure-table")
export class RelationEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    formId: number;

    @Column({ name: "relation_type", nullable: true })
    relationType: ChildRelationType;

    @TreeChildren()
    children: RelationEntity[];

    @TreeParent()
    parent: RelationEntity;
}