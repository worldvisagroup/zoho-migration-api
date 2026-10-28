import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value || !isValidObjectId(value)) {
      const paramName = metadata.data ?? 'id';
      throw new BadRequestException(
        `Invalid parameter "${paramName}": expected a valid 24-character hexadecimal MongoDB ObjectId`,
      );
    }
    return value;
  }
}
