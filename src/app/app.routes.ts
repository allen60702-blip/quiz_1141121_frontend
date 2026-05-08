import { Routes } from '@angular/router';
import { Question1Component } from './@question/question-1/question-1.component';
import { Question2Component } from './@question/question-2/question-2.component';
import { Question3Component } from './@question/question-3/question-3.component';
import { Result1Component } from './@result/result-1/result-1.component';
import { Result2Component } from './@result/result-2/result-2.component';
import { Confirm1Component } from './@result-confirm/confirm-1/confirm-1.component';
import { Confirm2Component } from './@result-confirm/confirm-2/confirm-2.component';
import { QuestionnaireHomepageComponent } from './questionnaire-homepage/questionnaire-homepage.component';
import { QuestionnaireManagerComponent } from './questionnaire-manager/questionnaire-manager.component';
import { QuestionnaireCreateComponent } from './questionnaire-create/questionnaire-create.component';
import { QuestionnaireEditComponent } from './questionnaire-edit/questionnaire-edit.component';
import { QuestionnaireFillinPreviewComponent } from './questionnaire-fillin-preview/questionnaire-fillin-preview.component';

export const routes: Routes = [
  { path: 'question-1', component: Question1Component },
  { path: 'question/:id', component: Question2Component },
  { path: 'question-3', component: Question3Component },
  { path: 'result-1', component: Result1Component },
  { path: 'result-2', component: Result2Component },
  { path: 'confirm-1', component: Confirm1Component },
  { path: 'confirm-2', component: Confirm2Component },
  { path: 'questionnaire-homepage', component: QuestionnaireHomepageComponent },
  { path: 'questionnaire-manager', component: QuestionnaireManagerComponent },
  { path: 'questionnaire-create', component: QuestionnaireCreateComponent },
  { path: 'questionnaire-edit/:id', component: QuestionnaireEditComponent },
  { path: 'questionnaire-fillin-preview', component: QuestionnaireFillinPreviewComponent },
];
