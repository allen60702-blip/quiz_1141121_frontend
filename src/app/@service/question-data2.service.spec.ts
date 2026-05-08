import { TestBed } from '@angular/core/testing';

import { QuestionData2Service } from './question-data2.service';

describe('QuestionData2Service', () => {
  let service: QuestionData2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionData2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
