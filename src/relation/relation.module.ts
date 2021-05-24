import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationRepository } from 'src/database/relation.repository';
import { RelationService } from './relation.service';

@Module({
  controllers: [],
  providers: [RelationService],
  imports: [TypeOrmModule.forFeature([RelationRepository])],
  exports: [RelationService]
})
export class RelationModule {}
