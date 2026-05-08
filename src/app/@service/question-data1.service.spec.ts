import { TestBed } from '@angular/core/testing';

import { QuestionData1Service } from './question-data1.service';

describe('QuestionData1Service', () => {
  let service: QuestionData1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionData1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
