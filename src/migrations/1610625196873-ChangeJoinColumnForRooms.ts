/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeJoinColumnForRooms1610625196873
    implements MigrationInterface {
    name = 'ChangeJoinColumnForRooms1610625196873';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "matching" DROP CONSTRAINT "FK_1a60b93d3298767cf183fc733bd"',
        );
        await queryRunner.query(
            'ALTER TABLE "matching" DROP CONSTRAINT "UQ_1a60b93d3298767cf183fc733bd"',
        );
        await queryRunner.query('ALTER TABLE "room" ADD "matching_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "room" ADD CONSTRAINT "UQ_d7e3878ebe0fee147900e477d6b" UNIQUE ("matching_id")',
        );
        await queryRunner.query(
            'ALTER TABLE "room" ADD CONSTRAINT "FK_d7e3878ebe0fee147900e477d6b" FOREIGN KEY ("matching_id") REFERENCES "matching"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'UPDATE "room" SET matching_id = subquery.new_matching_id FROM (SELECT "room".*, "matching".id as new_matching_id FROM "room" LEFT JOIN "matching" ON "room".id = "matching".room_id) as subquery WHERE "room".id = subquery.id',
        );
        await queryRunner.query('ALTER TABLE "matching" DROP COLUMN "room_id"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "room" DROP CONSTRAINT "FK_d7e3878ebe0fee147900e477d6b"',
        );
        await queryRunner.query(
            'ALTER TABLE "room" DROP CONSTRAINT "UQ_d7e3878ebe0fee147900e477d6b"',
        );
        await queryRunner.query('ALTER TABLE "room" DROP COLUMN "matching_id"');
        await queryRunner.query('ALTER TABLE "matching" ADD "room_id" uuid');
        await queryRunner.query(
            'ALTER TABLE "matching" ADD CONSTRAINT "UQ_1a60b93d3298767cf183fc733bd" UNIQUE ("room_id")',
        );
        await queryRunner.query(
            'ALTER TABLE "matching" ADD CONSTRAINT "FK_1a60b93d3298767cf183fc733bd" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
        );
    }
}
