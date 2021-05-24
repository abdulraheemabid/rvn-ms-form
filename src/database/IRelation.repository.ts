import { ChildRelationType } from "src/utils/constants.utils";
import { RelationEntity } from "./relation.entity";
import { Request } from 'express';

/**
 * Defines the interface of RelationRepository
 * 
 * If need to swap out repository e.g change the Database underneath, the new repository should implement this interface
 */
export interface IRelationRepository {
    findNodes(options: any): Promise<RelationEntity[]>;
    findOneNodeById(id: number, options: any): Promise<RelationEntity>;
    findOneNodeByFormId(formId: number, options: any): Promise<RelationEntity>;
    saveNode(formId: number, parentFormId: number, relationType: ChildRelationType, request: Request): Promise<RelationEntity>;
    updateNode(updatedRelation: RelationEntity, request: Request): Promise<any>;
    softDeleteNode(id: number): Promise<any>;
    deleteNodeCreateTreeForDescendants(formId: number): Promise<number[]>;
    findNodeImidiateAncestor(formId: number): Promise<number>;
    findNodeImidiateDescendant(formId: number): Promise<number[]>;
    findNodeTrees(): Promise<RelationEntity[]>;
    findRNodeRoots(): Promise<RelationEntity[]>;
    findNodeDescendants(parentFormId: number): Promise<RelationEntity[]>;
    findNodeDescendantsTree(parentFormId: number): Promise<RelationEntity>;
    countNodeDescendants(parentFormId: number): Promise<number>;
    findNodeAncestors(childFormId: number): Promise<RelationEntity[]>;
    findNodeAncestorsTree(childFormId: number): Promise<RelationEntity>;
    countNodeAncestors(childFormId: number): Promise<number>;
}