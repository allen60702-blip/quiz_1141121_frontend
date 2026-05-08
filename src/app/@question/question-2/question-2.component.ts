import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatDialog } from '@angular/material/dialog';
import { Dialog2Component } from '../../@dialog/dialog-2/dialog-2.component';
import { CommonModule } from '@angular/common';

// 從 QuestionComponent 匯入 interface
// 注意：路徑要指向你剛才寫 interface 的那個檔案
import { CreateReq, Question } from '../../@interface/question/question.component';
import { ApiService } from '../../@service/api.service';
// 新增 ActivatedRoute：用於抓取 URL 參數

@Component({
  selector: 'app-question-2',
  standalone: true, // 如果你是 Angular 17+
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            FormsModule, Dialog2Component, CommonModule,
          ],
  templateUrl: './question-2.component.html',
  styleUrl: './question-2.component.scss'
})

export class Question2Component {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: ApiService) {}
  readonly dialog2 = inject(MatDialog);

  // 準備收集使用者填寫的資料 (FillinReq 格式)
  inputName: string = "";
  inputPhone: string = "";
  inputEmail: string = "";
  // inputAge!: number; // 後端校驗需 >= 18
  inputAge: number | null = null;
  textareaAns!: string;

  quizId!: number;
  // 存放從後端抓到的完整問卷與題目
  questionData: any = {
    quiz: null,
    questionList: [] // 這裡存放從後端抓回來的原始題目資訊
  };

  ngOnInit() {
    // 1.從 URL 抓取 ID，例如 /question/1 -> quizId = 1
    this.quizId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.quizId) {
      this.fetchFullQuizData();
    }
  }

  fetchFullQuizData() {
    // 1. 先抓問卷基本資訊
    this.apiService.getApi('api/quiz/getAll').subscribe((res: any) => {
      if (res.code === 200 && res.quizList) {
        this.questionData.quiz = res.quizList.find((q: any) => q.id === this.quizId);
      }
    });

    // 2. 抓題目列表
    this.apiService.getApi(`api/quiz/get_question_list?quizId=${this.quizId}`).subscribe((res: any) => {
      if (res.code === 200) {
        this.questionData.questionList = res.questionList.map((q: any) => {
          return {
            ...q,
            userAnswer: q.type === 'Multi' ? [] : "", // 初始化使用者的答案空間
            optionArray: q.options ? q.options.split(';') : []
          };
        });
      }
    });
  }

  openDialog() {
    // 基本欄位檢查
    if (!this.inputName || !this.inputPhone || !this.inputEmail || !this.inputAge) {
      alert("請完整填寫基本資料");
      return;
    }
    if (this.inputAge < 18) {
      alert("抱歉，本問卷填寫者需年滿 18 歲");
      return;
    }

    let dialogRef = this.dialog2.open(Dialog2Component, {
      width: '300px',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      // 只有當 dialog 回傳 "confirm" 時才執行送出
      if (res === "confirm") {
        this.submitAnswers();
      }
    });
  }

  onCheckboxChange(question: any, option: string, event: any) {
    if (event.target.checked) {
      // 勾選：加入陣列
      question.userAnswer.push(option);
    } else {
      // 取消勾選：移出陣列
      const index = question.userAnswer.indexOf(option);
      if (index > -1) {
        question.userAnswer.splice(index, 1);
      }
    }
  }

  // 點擊「送出」時，應該呼叫的是 api/quiz/fillin
  submitAnswers() {
    //重點：封裝符合後端 FillinReq 結構的資料
    const fillinReq = {
      quizId: this.quizId,
      name: this.inputName,
      email: this.inputEmail,
      phone: this.inputPhone,
      age: Number(this.inputAge), // 強制轉數字避免後端校驗錯誤
      // 這裡要對應後端的 List<AnswerVo>
      answerVoList: this.questionData.questionList.map((q: any) => {
        return {
          // 對應後端的 AnswerVo.question (Question Entity)
          question: {
            quizId: this.quizId,
            questionId: q.questionId,
            question: q.question,
            type: q.type,
            required: !!q.required, // 確保名稱與後端 boolean required 一致
            options: q.options || ""
          },
          // 對應後端的 AnswerVo.answer (String)
          // 處理答案：多選轉分號字串，單選或簡答直接傳入
          answer: Array.isArray(q.userAnswer) ? q.userAnswer.join(';') : String(q.userAnswer || "")
        };
      })
    };

    console.log('傳送至後端的 Payload:', JSON.stringify(fillinReq));

    // 呼叫後端 API
    this.apiService.postApi('api/quiz/fillin', fillinReq).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          console.log('提交成功！前往預覽頁');
          // 提交成功後才進行跳轉
          this.router.navigate(['/questionnaire-fillin-preview'], {
            state: {
              quizInfo: this.questionData.quiz,
              userInfo: {
                name: this.inputName,
                phone: this.inputPhone,
                email: this.inputEmail,
                age: this.inputAge
              },
              answers: this.questionData.questionList
            }
          });
        } else {
          // 處理後端回傳的錯誤 (例如 400 參數錯誤)
          alert('提交失敗：' + (res.message || '格式不正確'));
        }
      },
      error: (err) => {
        console.error('API 錯誤 (500)：', err);
        alert('伺服器內部錯誤，請檢查後端控制台');
      }
    });
  }


}

// quizData() {
//     // 2.向後端請求問卷題目 (對應 QuizController.getQuestionList)
//     this.apiService.getApi(`api/quiz/get_question_list?quizId=${this.quizId}`).subscribe((res: any) => {
//         // 你需要後端同時回傳 Quiz 的 Title 和 Description
//         // 如果你的 getByQuizId 只回傳題目，建議後端修改回傳物件包含問卷資訊
//         this.questionData = res;

//         // 3. 資料前處理：將 options 字串("蛋餅;漢堡")轉為陣列，並初始化答案欄位
//         this.questionData.questionList.forEach((q: any) => {
//           // 初始化答案欄位
//           // 如果是多選(Multi)，初始化為空陣列 []
//           // 如果是單選(Single)或文字(Text)，初始化為空字串 ""
//           q.userAnswer = q.type === 'Multi' ? [] : "";
//           if (q.options) {
//             q.optionArray = q.options.split(';');
//           }
//         });
//     });
//  }
  // 原本的死資料寫法
  // // 多選M(multiple) 單選Q(single) 文字輸入T
  // questionData = {
  //   id: 1,
  //   title: '早餐問卷調查',
  //   startDate: '2026/02/21',
  //   endDate: '2026/12/03',
  //   description: '取樣台灣各式各樣類型的早餐型態',
  //   questionList: [
  //     {
  //       questionId: 1,
  //       required: true,
  //       question: '您通常吃早餐的時間點為何(單選)',
  //       type: 'Single',
  //       options: [
  //         { optionName: '05:00~07:00'},
  //         { optionName: '07:00~09:00'},
  //         { optionName: '09:00~11:00'},
  //       ]
  //     },
  //     {
  //       questionId: 2,
  //       required: true,
  //       question: '您通常選擇的早餐為何(多選)',
  //       type: 'Multi',
  //       options: [
  //         { optionName: '蛋餅'},
  //         { optionName: '蘿蔔糕'},
  //         { optionName: '漢堡'},
  //         { optionName: '煎餃'},
  //         { optionName: '飯糰'},
  //         { optionName: '燒餅油條'},
  //         { optionName: '鐵板麵'},
  //         { optionName: '其他'},
  //       ]
  //     },
  //     {
  //       questionId: 3,
  //       required: false,
  //       question: '您對臺灣的早餐類型有何看法',
  //       type: 'Text',
  //       options: []
  //     },
  //   ]
  // }

  // submitToBackend() {
  //   // 進行格式轉換，將前端格式轉為 Java 的 CreateReq 格式
  //   const finalPayload: CreateReq = {
  //     title: this.questionData.title,
  //     description: this.questionData.description,
  //     // 將 2025/11/21 轉換為 2025-11-21 以符合 Java @JsonFormat
  //     startDate: this.questionData.startDate.replace(/\//g, '-'),
  //     endDate: this.questionData.endDate.replace(/\//g, '-'),
  //     published: true, // 手動指定，或從畫面獲取
  //     // 關鍵轉換：將包含物件陣列的 options 扁平化為字串
  //     questionList: this.questionData.questionList.map(q => {
  //       return {
  //         questionId: q.questionId,
  //         required: q.required,
  //         question: q.question,
  //         type: q.type,
  //         // 這裡將 [{optionName: '蛋餅'}] 轉為 "蛋餅;蘿蔔糕"
  //         options: q.options.map((opt: any) => opt.optionName).join(';')
  //       };
  //     })

  //   };

  //   console.log('準備送往後端的資料：', finalPayload);
  //   // 👈 真正呼叫後端 API (對照你 Controller 的路徑)
  //   // 你的 Controller 是 @RequestMapping("/api") + @PostMapping("quiz/create")
  //   // 正式發送 API 請求
  //   this.apiService.postApi('api/quiz/create', finalPayload).subscribe({
  //     next: (res : any) => {
  //       console.log('成功連上 Eclipse！後端回傳：', res);
  //       alert('問卷建立成功！');
  //     },
  //     error: (err) => {
  //       console.error('串接失敗：', err);
  //       alert('連不到後端，請確認 Eclipse 的專案是否已啟動，且路徑正確。');
  //     }
  //   });
  // }



  // openDialog() {
  //   let dialogRef = this.dialog2.open(Dialog2Component, {
  //     width: '300px',
  //     height: '300px',
  //   });

  //   // 我等待我開啟的這個dialog(dialogRef) 等她關閉(afterClosed())
  //   dialogRef.afterClosed().subscribe((res) => {
  //     // 判斷如果丟出來的內容有值 如果沒有值會是undefind
  //     // 判斷：如果使用者在 Dialog 點了「確定」（通常 Dialog 會回傳 true 或 1）
  //     if (res) {
  //       console.log('使用者確認送出，開始執行後端串接...');
  //       this.submitToBackend(); // 👈 在這裡觸發你的 API 動作
  //     } else {
  //       console.log('使用者取消送出');
  //     }
  //   });
  // }
