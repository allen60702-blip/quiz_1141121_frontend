import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../@service/api.service';

@Component({
  selector: 'app-questionnaire-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './questionnaire-edit.component.html',
  styleUrl: './questionnaire-edit.component.scss'
})
export class QuestionnaireEditComponent {

  constructor(private router: Router,
              private apiService: ApiService,
              private activatedRoute: ActivatedRoute) {}

  quizId: number = 0;

  // 問卷基本資料
  quizObj = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    published: false
  };

  // 題目列表
  questionList: any[] = [];

  ngOnInit() {
    // 1. 從路由取得 ID
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.quizId = Number(idParam);
      this.fetchQuizData();
    }
  }

  // 2. 向後端取得該問卷的詳細資料
  fetchQuizData() {
    // 步驟 1：取得所有問卷，找出當前這份的基本資料 (因為你的後端 getQuestionList 沒傳問卷資料)
    this.apiService.getApi('api/quiz/getAll').subscribe((quizRes: any) => {
      if (quizRes.code === 200) {
        // 從列表中找出符合 id 的問卷
        const currentQuiz = quizRes.quizList.find((q: any) => q.id === this.quizId);
        if (currentQuiz) {
          this.quizObj = {
            title: currentQuiz.title,
            description: currentQuiz.description,
            startDate: currentQuiz.startDate,
            endDate: currentQuiz.endDate,
            published: currentQuiz.published
          };
        }
      }
    });

    // 步驟 2：取得問卷的題目列表
    this.apiService.getApi(`api/quiz/get_question_list?quizId=${this.quizId}`).subscribe((qRes: any) => {
      if (qRes.code === 200) {
        // 將後端的題目放入前端變數中
        this.questionList = qRes.questionList || [];
      }
    });
  }

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

  deleteQuestion(index: number) {
    if (this.questionList.length > 1) {
      this.questionList.splice(index, 1);
      this.questionList.forEach((q, i) => q.questionId = i + 1);
    }
  }

  // 3. 提交更新
  update() {
    if (!this.quizObj.title || !this.quizObj.startDate || !this.quizObj.endDate) {
      alert('請檢查必填欄位');
      return;
    }

    // 關鍵修正：因為你 Java 後端的 UpdateReq 會檢查 item.getQuizId()
    // 所以我們必須幫每個題目強制塞入當前的 quizId
    this.questionList.forEach(q => q.quizId = this.quizId);

    // 根據後端更新介面需求，通常需要帶入 quizId
    const payload = {
      quizId: this.quizId,
      title: this.quizObj.title,
      description: this.quizObj.description,
      startDate: this.quizObj.startDate,
      endDate: this.quizObj.endDate,
      published: this.quizObj.published,
      questionList: this.questionList
    };

    this.apiService.postApi('api/quiz/update', payload).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          alert('問卷更新成功！');
          this.router.navigate(['/questionnaire-manager']);
        } else {
          alert('更新失敗：' + res.message);
        }
      },
      error: (err) => {
        alert('連線錯誤，請稍後再試');
      }
    });
  }

}
