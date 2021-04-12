import { Test, TestingModule } from '@nestjs/testing';
import { DasClientService } from './das-client.service';

describe('DasClientService', () => {
  let service: DasClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DasClientService],
    }).compile();

    service = module.get<DasClientService>(DasClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
