import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireManagerComponent } from './questionnaire-manager.component';

describe('QuestionnaireManagerComponent', () => {
  let component: QuestionnaireManagerComponent;
  let fixture: ComponentFixture<QuestionnaireManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
