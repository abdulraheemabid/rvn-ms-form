import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationRepository } from 'src/database/relation.repository';
import { RelationController } from './relation.controller';
import { RelationService } from './relation.service';

@Module({
  controllers: [RelationController],
  providers: [RelationService],
  imports: [TypeOrmModule.forFeature([RelationRepository])],
  exports: [RelationService]
})
export class RelationModule {}
