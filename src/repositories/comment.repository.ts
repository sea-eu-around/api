/* eslint-disable */
import { EntityRepository, TreeRepository } from 'typeorm';

import { CommentEntity } from '../entities/comment.entity';
@EntityRepository(CommentEntity)
export class CommentRepository extends TreeRepository<CommentEntity> {
    createRelationMaps = (alias, rawResults) => {
        const _this = this;
        return rawResults.map(function (rawResult) {
            const joinColumn = _this.metadata.treeParentRelation.joinColumns[0];
            // fixes issue #2518, default to databaseName property when givenDatabaseName is not set
            const joinColumnName =
                joinColumn.givenDatabaseName || joinColumn.databaseName;
            const id =
                rawResult[
                    alias + '_' + _this.metadata.primaryColumns[0].databaseName
                ];
            const parentId = rawResult[alias + '_' + joinColumnName];
            return {
                id: _this.manager.connection.driver.prepareHydratedValue(
                    id,
                    _this.metadata.primaryColumns[0],
                ),
                parentId: _this.manager.connection.driver.prepareHydratedValue(
                    parentId,
                    joinColumn,
                ),
            };
        });
    };
    buildChildrenEntityTree = function(entity, entities, relationMaps) {
        const _this = this;
        const childProperty = this.metadata.treeChildrenRelation.propertyName;
        const parentEntityId = this.metadata.primaryColumns[0].getEntityValue(
            entity,
        );
        const childRelationMaps = relationMaps.filter(function(relationMap) {
            return relationMap.parentId === parentEntityId;
        });
        const childIds = new Set(
            childRelationMaps.map(function (relationMap) {
                return relationMap.id;
            }),
        );
        entity[childProperty] = entities.filter(function(entity) {
            return childIds.has(
                entity[_this.metadata.primaryColumns[0].propertyName],
            );
        });
        entity[childProperty].forEach(function(childEntity) {
            _this.buildChildrenEntityTree(childEntity, entities, relationMaps);
        });
    };
}
