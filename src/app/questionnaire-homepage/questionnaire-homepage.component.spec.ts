import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireHomepageComponent } from './questionnaire-homepage.component';

describe('QuestionnaireHomepageComponent', () => {
  let component: QuestionnaireHomepageComponent;
  let fixture: ComponentFixture<QuestionnaireHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
