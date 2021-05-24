import { isNullOrUndefined, RecordDeleteDTO } from '@abdulraheemabid/rvn-nest-shared';
import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { RelationService } from 'src/relation/relation.service';
import { getRCPException } from 'src/utils/exception.util';
import { RecordService } from '../Record.service';

/**
 * Validates when record is being deleted, that a new valid parent record id has been provided.
 */
@Injectable()
export class OnDeleteNewParentValidatorPipe implements PipeTransform {
  constructor(private relationSevice: RelationService, private recordService: RecordService) { }
  async transform(value: RecordDeleteDTO, metadata: ArgumentMetadata): Promise<RecordDeleteDTO> {

    const childrenCount = await this.relationSevice.getFormChildrenCount(value.formId);

    if (childrenCount > 1 && isNullOrUndefined(value.newParentIdForChildren))
      throw getRCPException({ message: `newParentIdForChildren not provided`, statusCode: HttpStatus.BAD_REQUEST })


    if (childrenCount > 1 && !isNullOrUndefined(value.newParentIdForChildren)) {

      try {
        await this.recordService.fetchRecordById({ formId: value.formId, recordId: value.newParentIdForChildren });
      } catch (error) {
        throw getRCPException({ message: `value provided for newParentIdForChildren is not a valid record`, statusCode: HttpStatus.BAD_REQUEST })
      }

      if (value.recordId == value.newParentIdForChildren) {
        throw getRCPException({ message: `value provided for newParentIdForChildren cannot be the same as the record which is going to be deleted`, statusCode: HttpStatus.BAD_REQUEST })
      }

    }

    return value;
  }
}
