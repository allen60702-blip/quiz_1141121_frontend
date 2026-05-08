import { Router, RouterLink, RouterLinkActive, RouterOutlet, } from '@angular/router';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import Chart from 'chart.js/auto';
import { Dialog1Component } from '../@dialog/dialog-1/dialog-1.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../@service/api.service';
import { AccountAuthService } from '../@service/account-auth.service';


@Component({
  selector: 'app-questionnaire-homepage',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
    MatTableModule, MatPaginatorModule, MatIconModule,
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatTabsModule, MatButtonModule, MatSelectModule,
    Dialog1Component,
  ],
  templateUrl: './questionnaire-homepage.component.html',
  styleUrl: './questionnaire-homepage.component.scss'
})

export class QuestionnaireHomepageComponent {
  title = 'Dynamic-Questionnaire';
  searchData!: string;
  inputDate!: string;
  inputDate1!: string;

  constructor(private router: Router) { }
  readonly dialog1 = inject(MatDialog);
  private apiService = inject(ApiService); // 注入 API Service
  public accountAuthService = inject(AccountAuthService); // 注入以在 HTML 使用

  displayedColumns: string[] = ['position', 'name', 'status', 'startTime', 'endTime', 'result'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // 修正：原本等於 ELEMENT_DATA，現在改為空陣列
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // changePage(url: string) {
  //   this.router.navigateByUrl(url);
  // }

  // changeInput() {
  //   console.log("取得的文字:", this.searchData);
  //   const filterData = this.searchData.trim().toLocaleLowerCase();
  //   this.dataSource.filter = filterData;
  // }

  // 修改按鈕觸發的方法
  changeInput() {
    const filterValues = {
      name: this.searchData || '',
      fromDate: this.inputDate || '',
      toDate: this.inputDate1 || ''
    };

    // 將物件轉為字串傳入，觸發 filterPredicate
    this.dataSource.filter = JSON.stringify(filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    let dialogRef = this.dialog1.open(Dialog1Component, {
      width: '400px', // 只設寬度限制，高度讓它自動撐開
      maxWidth: '90vw', // 手機版防溢出
      panelClass: 'custom-dialog-container' // 選用：自定義背景樣式
    });

    // 我等待我開啟的這個dialog(dialogRef) 等她關閉(afterClosed())
    dialogRef.afterClosed().subscribe((res) => {
      // res 為登入成功標記
      if (res === "login_success") {
        // 如果登入後發現是管理員，直接跳轉後台
        if (this.accountAuthService.isAdmin) {
          this.router.navigate(['/questionnaire-manager']);
        }
      }
    });
  }

  onLogout() {
    this.accountAuthService.logout();
    // 呼叫後端登出 API
    this.apiService.getApi('api/quiz/logout').subscribe();
    alert('已登出');
  }

  ngOnInit() {
    this.fetchQuizList();
  }

  fetchQuizList() {
    // 呼叫後端取得所有問卷
    this.apiService.getApi('api/quiz/getAll').subscribe((res: any) => {
      if (res.code === 200) {
        // 將後端 Quiz 傳回的問卷清單放入 Table
        // 注意：後端的欄位名(id, title)需對應到前端的(position, name)
        // filter 先過濾為 已發佈的
        const matchData = res.quizList.filter((item : any) => item.published).map((item: any) => ({
          position: item.id,
          name: item.title,
          status: this.getPublishStatus(item.startDate, item.endDate, item.published),
          startTime: item.startDate,
          endTime: item.endDate,
          pathQ: `/question/${item.id}`, // 問卷的問題 動態路徑
          result: '前往',
          path: `/result/${item.id}` // 問卷的結果
        }));
        this.dataSource.data = matchData;
      }
    });
  }

  // 根據日期與發布狀態判斷問卷狀態
  getPublishStatus(start: string, end: string, published: boolean): string {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (!published) return '未發布';
    if (now < startDate) return '尚未開始';
    if (now > endDate) return '已結束';
    return '進行中';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // 自定義篩選邏輯
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
    // 解析搜尋條件物件
    const searchTerms = JSON.parse(filter);

    // 1. 名稱篩選 (模糊搜尋)
    const nameMatch = data.name.toLowerCase().includes(searchTerms.name.toLowerCase());

    // 2. 日期範圍篩選
    const date = new Date(data.startTime); // 使用開始時間作為基準，或根據需求調整
    const start = searchTerms.fromDate ? new Date(searchTerms.fromDate) : null;
    const end = searchTerms.toDate ? new Date(searchTerms.toDate) : null;

    let dateMatch = true;
    if (start && end) {
      dateMatch = date >= start && date <= end;
    } else if (start) {
      dateMatch = date >= start;
    } else if (end) {
      dateMatch = date <= end;
    }
    return nameMatch && dateMatch;
    };
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  status: string;
  startTime: string;
  endTime: string;
  result: string;
  path: string;
  pathQ: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, name: '早餐吃什麼', status: '尚未開始', startTime: '2025-11-21', endTime: '2025-12-03', result: '前往', path: '/result-1', pathQ: '/question-1' },
//   { position: 2, name: '午餐吃什麼', status: '已結束', startTime: '2025-11-27', endTime: '2025-12-07', result: '前往', path: '/result-1', pathQ: '/question-2' },
//   { position: 3, name: '晚餐吃什麼', status: '未發布', startTime: '2025-12-01', endTime: '2025-12-09', result: '前往', path: '', pathQ: '' },
//   { position: 4, name: '消夜吃什麼', status: '已結束', startTime: '2025-12-05', endTime: '2025-12-11', result: '前往', path: '', pathQ: '' },
//   { position: 5, name: '中文流行音樂調查', status: '進行中', startTime: '2025-12-07', endTime: '2025-12-13', result: '前往', path: '', pathQ: '' },
//   { position: 6, name: '英文流行音樂調查', status: '尚未開始', startTime: '2025-12-11', endTime: '2025-12-17', result: '前往', path: '', pathQ: '' },
//   { position: 7, name: '日文流行音樂調查', status: '已結束', startTime: '2025-12-15', endTime: '2025-12-20', result: '前往', path: '', pathQ: '' },
//   { position: 8, name: '韓文流行音樂調查', status: '未發布', startTime: '2025-12-19', endTime: '2025-12-26', result: '前往', path: '', pathQ: '' },
//   { position: 9, name: 'C1', status: '已結束', startTime: '2024-11-05', endTime: '2025-12-21', result: '前往', path: '', pathQ: '' },
//   { position: 10, name: 'C2', status: '進行中', startTime: '2024-11-06', endTime: '2025-12-25', result: '前往', path: '', pathQ: '' },
//   { position: 11, name: 'C3', status: '尚未開始', startTime: '2024-11-08', endTime: '2025-12-27', result: '前往', path: '', pathQ: '' },
//   { position: 12, name: 'C4', status: '已結束', startTime: '2024-11-15', endTime: '2025-12-31', result: '前往', path: '', pathQ: '' },
// ];
