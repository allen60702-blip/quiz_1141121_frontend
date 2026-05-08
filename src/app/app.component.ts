import { Router, RouterLink, RouterLinkActive, RouterOutlet, } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { provideNativeDateAdapter} from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
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
import { MatSelectModule } from '@angular/material/select';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
    MatTableModule, MatPaginatorModule, MatIconModule,
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatTabsModule, MatButtonModule, MatSelectModule,
    Question1Component, Question2Component, Question3Component,
    Result1Component, Result2Component,
    Confirm1Component, Confirm2Component,
    QuestionnaireHomepageComponent, QuestionnaireManagerComponent, QuestionnaireCreateComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
