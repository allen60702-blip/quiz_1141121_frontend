import { Router, RouterLink, RouterLinkActive, RouterOutlet, } from '@angular/router';
import { AfterViewInit, Component, ViewChild, OnInit, inject } from '@angular/core';
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
import { ApiService } from '../@service/api.service';
import { AccountAuthService } from '../@service/account-auth.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-questionnaire-manager',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
    MatTableModule, MatPaginatorModule, MatIconModule,
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatTabsModule, MatButtonModule, MatSelectModule,
  ],
  templateUrl: './questionnaire-manager.component.html',
  styleUrl: './questionnaire-manager.component.scss'
})
export class QuestionnaireManagerComponent {
  searchData: string = ""; // 文字搜尋
  inputDate: string = ""; // 日期區間搜尋1
  inputDate1: string = ""; // 日期區間搜尋2
  // 儲存被勾選刪除用的問卷 ID
  selectedIds = new Set<number>();

  constructor(private router: Router, private apiService: ApiService) {}
  public accountAuthService = inject(AccountAuthService); // 注入以取得用戶名
  displayedColumns: string[] = ['select', 'position', 'name', 'status', 'operation', 'startTime', 'endTime', 'result'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<any>([]); // 初始化為空

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  changePage(url: string) {
    this.router.navigateByUrl(url);
  }

  // changeInput() {
  //   console.log("取得的文字:", this.searchData);
  //   const filterData = this.searchData.trim().toLocaleLowerCase();
  //   this.dataSource.filter = filterData;
  // }

  // 搜尋
  changeInput() {
    const filterValues = {
      name: this.searchData || '',
      fromDate: this.inputDate || '',
      toDate: this.inputDate1 || ''
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.fetchData();
  }

  // 與首頁類似，但顯示所有問卷 (包含未發布)
  // 從後端取得所有問卷資料
  fetchData() {
    this.apiService.getApi('api/quiz/getAll').subscribe((res: any) => {
      if (res.code === 200) {
        this.dataSource.data = res.quizList.map((item: any) => ({
          position: item.id,
          name: item.title,
          status: this.getPublishStatus(item.startDate, item.endDate, item.published),
          startTime: item.startDate,
          endTime: item.endDate,
          pathQ: `/question/${item.id}`,
          result: '前往',
          path: `/result/${item.id}`
        }));
        this.dataSource.paginator = this.paginator;
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

  // 勾選刪除的方法
  toggleSelection(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  // [新增] 上方 Action Bar 的編輯邏輯
  editSelected() {
    if (this.selectedIds.size !== 1) {
      alert('請「只選擇一筆」資料進行編輯');
      return;
    }
    const id = Array.from(this.selectedIds)[0];
    this.router.navigate(['/questionnaire-edit', id]);
  }

  // 實作刪除按鈕 (對應你的 QuizController.delete)
  deleteSelected() {
    if (this.selectedIds.size == 0) {
      alert("請先選擇要刪除的問卷");
      return;
    };
    if (confirm(`確定要刪除這 ${this.selectedIds.size} 筆問卷嗎？`)) {
      const payload = { quizIdList: Array.from(this.selectedIds) };
      this.apiService.postApi('api/quiz/delete', payload).subscribe(res => {
        if (res.code === 200) {
          alert('刪除成功');
          this.selectedIds.clear(); // 清空勾選
          this.fetchData(); // 重新整理頁面
        } else {
          alert('刪除失敗：' + res.message);
        }
      });
    }
  }

  onLogout() {
    if(confirm('確定要登出管理系統嗎？')) {
      this.apiService.getApi('api/quiz/logout').subscribe();
      this.accountAuthService.logout();
      this.router.navigate(['/questionnaire-homepage']);
    }
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
//   { position: 1, name: '早餐吃什麼', status: '尚未開始', startTime: '2024-11-05', endTime: '2024-12-01', result: '前往', path: '/result-1', pathQ: '/question-1' },
//   { position: 2, name: '午餐吃什麼', status: '已結束', startTime: '2024-11-06', endTime: '2024-12-02', result: '前往', path: '/result-1', pathQ: '/question-2'},
//   { position: 3, name: '晚餐吃什麼', status: '未發布', startTime: '2024-11-08', endTime: '2024-12-03', result: '前往', path: '', pathQ: '' },
//   { position: 4, name: '消夜吃什麼', status: '已結束', startTime: '2024-11-15', endTime: '2024-12-04', result: '前往', path: '', pathQ: '' },
//   { position: 5, name: '中文流行音樂調查', status: '進行中', startTime: '2024-11-05', endTime: '2024-12-05', result: '前往', path: '', pathQ: '' },
//   { position: 6, name: '英文流行音樂調查', status: '尚未開始', startTime: '2024-11-06', endTime: '2024-12-06', result: '前往', path: '', pathQ: '' },
//   { position: 7, name: '日文流行音樂調查', status: '已結束', startTime: '2024-11-08', endTime: '2024-12-07', result: '前往', path: '', pathQ: '' },
//   { position: 8, name: '韓文流行音樂調查', status: '未發布', startTime: '2024-11-15', endTime: '2024-12-08', result: '前往', path: '', pathQ: '' },
//   { position: 9, name: 'C1', status: '已結束', startTime: '2024-11-05', endTime: '2024-12-09', result: '前往', path: '', pathQ: '' },
//   { position: 10, name: 'C2', status: '進行中', startTime: '2024-11-06', endTime: '2024-12-10', result: '前往', path: '', pathQ: '' },
//   { position: 11, name: 'C3', status: '尚未開始', startTime: '2024-11-08', endTime: '2024-12-11', result: '前往', path: '', pathQ: '' },
//   { position: 12, name: 'C4', status: '已結束', startTime: '2024-11-15', endTime: '2024-12-12', result: '前往', path: '', pathQ: '' },
// ];

