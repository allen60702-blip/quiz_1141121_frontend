import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireFillinPreviewComponent } from './questionnaire-fillin-preview.component';

describe('QuestionnaireFillinPreviewComponent', () => {
  let component: QuestionnaireFillinPreviewComponent;
  let fixture: ComponentFixture<QuestionnaireFillinPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireFillinPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnaireFillinPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
