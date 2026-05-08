import { Component } from '@angular/core';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {

}

export interface QuestionOption {
  optionName: string;
}

export interface Question {
  questionId: number;
  required: boolean;
  question: string;
  type: string;
  options: string;
}

export interface CreateReq {
  title: string;
  description: string;
  startDate: string;      // Java 期望 yyyy-MM-dd
  endDate: string;        // Java 期望 yyyy-MM-dd
  published: boolean;     // 對應 Java 的 private boolean published
  questionList: Question[]; // 名稱必須與 Java 的變數名一模一樣
}

