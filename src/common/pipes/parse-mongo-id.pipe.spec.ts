import { BadRequestException } from '@nestjs/common';
import { ParseMongoIdPipe } from './parse-mongo-id.pipe.js';

describe('ParseMongoIdPipe', () => {
  let pipe: ParseMongoIdPipe;

  beforeEach(() => {
    pipe = new ParseMongoIdPipe();
  });

  it('should accept a valid 24-character hexadecimal ObjectId', () => {
    const validId = '507f1f77bcf86cd799439011';
    expect(pipe.transform(validId, { type: 'param', data: 'id' })).toBe(validId);
  });

  it('should throw BadRequestException when given an invalid ID', () => {
    expect(() => pipe.transform('invalid-id', { type: 'param', data: 'id' })).toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when given an empty string', () => {
    expect(() => pipe.transform('', { type: 'param', data: 'id' })).toThrow(BadRequestException);
  });
});
