import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireCreateComponent } from './questionnaire-create.component';

describe('QuestionnaireCreateComponent', () => {
  let component: QuestionnaireCreateComponent;
  let fixture: ComponentFixture<QuestionnaireCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
