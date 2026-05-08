import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-questionnaire-fillin-preview',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet,
            CommonModule,
          ],
  templateUrl: './questionnaire-fillin-preview.component.html',
  styleUrl: './questionnaire-fillin-preview.component.scss'
})
export class QuestionnaireFillinPreviewComponent {
  constructor(private router: Router) {}

  previewData: any;

  ngOnInit() {
    // 從 Router State 抓取資料
    this.previewData = history.state;

    // 如果沒資料（例如使用者直接重新整理頁面），就退回首頁
    if (!this.previewData || !this.previewData.quizInfo) {
      console.warn('無預覽資料，返回首頁');
      this.router.navigate(['/questionnaire-homepage']);
    }
  }

  /**
   * 判斷選項是否被使用者選取
   * @param userAnswer 使用者的答案 (可能是字串或陣列)
   * @param currentOpt 目前遍歷到的選項
   */
  isOptSelected(userAnswer: any, currentOpt: string): boolean {
    if (!userAnswer) return false;

    // 如果是陣列 (多選)
    if (Array.isArray(userAnswer)) {
      return userAnswer.includes(currentOpt);
    }

    // 如果是字串 (單選)
    return userAnswer === currentOpt;
  }

}
