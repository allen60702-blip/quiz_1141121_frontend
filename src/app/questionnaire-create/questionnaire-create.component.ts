import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../@service/api.service';

@Component({
  selector: 'app-questionnaire-create',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            FormsModule, CommonModule
  ],
  templateUrl: './questionnaire-create.component.html',
  styleUrl: './questionnaire-create.component.scss'
})
export class QuestionnaireCreateComponent {

  constructor(private apiService: ApiService, private router: Router){}

  // 1. 問卷基本資料
  quizObj = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    published: false
  };

  // 2. 題目列表 (預設給一題)
  questionList: any[] = [
    {
      questionId: 1,
      question: '',
      type: 'Single', // Single, Multi, Text
      required: false,
      options: ''    // 使用者輸入時用分號或逗號隔開
    }
  ];

  // 新增題目按鈕
  addQuestion() {
    // const newId = this.questionList.length + 1; // 匿名
    this.questionList.push({
      questionId: this.questionList.length + 1,
      question: '',
      type: 'Single',
      required: false,
      options: ''
    });
  }

  // 刪除指定題目
  deleteQuestion(index: number) {
    this.questionList.splice(index, 1);
    // 重新排序 ID
    this.questionList.forEach((q, i) => q.questionId = i + 1);
  }

  // 送出到後端
  submit() {
    // 檢查點 1：前端必填欄位驗證
    if (!this.quizObj.title || !this.quizObj.startDate || !this.quizObj.endDate) {
      alert('請填寫完整問卷資訊（名稱、開始與結束日期）');
      return;
    }

    // 檢查點 2：檢查日期邏輯 (結束不可早於開始)
    if (new Date(this.quizObj.startDate) > new Date(this.quizObj.endDate)) {
      alert('結束日期不能早於開始日期');
      return;
    }

    // 因為按鈕是「儲存並發布」，所以將狀態改為 true
    this.quizObj.published = true;

    // 封裝資料
    const payload = {
      title: this.quizObj.title,
      description: this.quizObj.description,
      startDate: this.quizObj.startDate,
      endDate: this.quizObj.endDate,
      // published: this.quizObj.published,
      published: true, // 儲存並發布時 published 設為 true
      questionList: this.questionList
    };

    console.log('準備送出的資料：', payload);

    // 執行 API 呼叫
    this.apiService.postApi('api/quiz/create', payload).subscribe({
      next: (res: any) => {
        console.log('後端回傳結果：', res);
        if (res.code === 200) {
          alert('問卷建立並發布成功！');
          this.router.navigate(['/questionnaire-manager']); // 回管理頁首頁
        } else {
          alert('建立失敗：' + (res.message || '伺服器錯誤'));
        }
      },
      error: (err) => {
        console.error('API 呼叫出錯:', err);
        alert('無法連線至後端伺服器，請檢查網路或後端程式是否啟動');
      }
    });

  }



}
