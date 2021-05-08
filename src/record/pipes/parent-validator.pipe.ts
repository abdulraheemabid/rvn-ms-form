import { isNullOrUndefined } from '@abdulraheemabid/rvn-nest-shared';
import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { RelationService } from 'src/relation/relation.service';
import { getRCPException } from 'src/utils/exception.util';
import { RecordDTO, RecordUpdateDTO } from '../Record.dto';
import { RecordService } from '../Record.service';

@Injectable()
export class ParentValidatorPipe implements PipeTransform {
  constructor(private recordService: RecordService, private relationService: RelationService) { }
  async transform(value: RecordDTO | RecordUpdateDTO, metadata: ArgumentMetadata) {

    const parentFormId = await this.relationService.getFormImidiateParentForm(value.formId);

    if (!isNullOrUndefined(parentFormId)) {

      if (isNullOrUndefined(value?.attributes?.parent?.recordId))
        throw getRCPException({ message: `Parent record not set`, statusCode: HttpStatus.BAD_REQUEST });

      try {
        await this.recordService.fetchRecordById({ formId: parentFormId, recordId: value.attributes.parent.recordId })
      } catch (e) {
        throw getRCPException({ message: `Parent record id is not valid`, statusCode: HttpStatus.NOT_FOUND });
      }
      
    } else if (!isNullOrUndefined(value?.attributes?.parent?.recordId)) {
      // if not a child and still passing in parent, delete the parent.
      delete value.attributes.parent;
    }

    return value;
  }
}
