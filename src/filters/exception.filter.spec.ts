import { UnhandledExceptionFilter } from './exception.filter';

describe('UnhandledExceptionFilter', () => {
  it('should be defined', () => {
    expect(new UnhandledExceptionFilter()).toBeDefined();
  });
});
