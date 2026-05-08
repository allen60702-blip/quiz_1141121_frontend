import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose,
  MatDialogContent, MatDialogRef, MatDialogTitle, MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../@service/api.service';
import { AccountAuthService } from '../../@service/account-auth.service';

@Component({
  selector: 'app-dialog-1',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogModule,
            FormsModule, CommonModule, ],
  templateUrl: './dialog-1.component.html',
  styleUrl: './dialog-1.component.scss'
})
export class Dialog1Component {
  constructor(private router: Router, private apiService: ApiService, private accountAuthService: AccountAuthService) { }
  readonly dialogRef = inject(MatDialogRef<Dialog1Component>);
  readonly data = inject(MAT_DIALOG_DATA);

  // 切換模式：false 為登入, true 為註冊
  isRegisterMode: boolean = false;

  // 共用欄位
  email: string = "";
  password: string = "";
  name: string = "";      // 註冊用
  phone: string = "";     // 註冊用
  age: number | null = null; // 註冊用
  errorData: string = "";

  // 切換模式的方法
  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorData = ""; // 切換時清空錯誤訊息
  }

  // 執行按鈕動作
  onSubmit() {
    if (this.isRegisterMode) {
      this.doRegister();
    } else {
      this.doLogin();
    }
  }

  // 登入邏輯
  doLogin() {
  const loginReq = { email: this.email, password: this.password };
  this.apiService.postApi('api/quiz/login', loginReq).subscribe((res: any) => {
    if (res.code === 200) {
      // 1. 儲存使用者資訊
      this.accountAuthService.setUser(res.name, res.admin);

      // 2. 關閉彈窗並傳回結果
      this.dialogRef.close("login_success");

      // 3. 關鍵跳轉邏輯
      if (res.admin) {
        // 如果是管理者，直接進入後台管理頁面
        this.router.navigate(['/questionnaire-manager']);
      } else {
        // 如果是一般使用者，導向歷史紀錄或留在首頁
        alert(`歡迎回來，${res.name}！`);
        // this.router.navigate(['/user-history']); // 選填：若有歷史頁面可跳轉
      }
    } else {
      this.errorData = res.message;
    }
  });
}

  // 註冊邏輯
  doRegister() {
    // 簡單前端檢查
    if (!this.email || !this.password || !this.name) {
      this.errorData = "請填寫必填欄位 (Email、密碼、姓名)";
      return;
    }

    // 欄位名稱必須與後端 User.java 的成員變數名完全一致
    const regReq = {
      email: this.email,
      password: this.password,
      name: this.name,
      phone: this.phone || "", // 如果沒填就給空字串，不要給 null
      age: Number(this.age) || 0, // 強制轉為數字，沒填就給 0
      admin: false,  // 顯式加上這個欄位，對應後端的 boolean admin
    };

    console.log("準備傳送的註冊資料:", JSON.stringify(regReq)); // 先在開發人員工具 檢查這行

    this.apiService.postApi('api/quiz/register', regReq).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          alert("註冊成功！");
          this.isRegisterMode = false;
        } else {
          this.errorData = res.message;
        }
      },
      error: (err) => {
        console.error("HTTP 錯誤詳情:", err);
        // 這裡嘗試從 err 物件中抓取後端可能吐出的詳細訊息
        if (err.error && err.error.message) {
          this.errorData = "伺服器錯誤: " + err.error.message;
        } else {
          this.errorData = "註冊失敗，請檢查後端控制台或網路設定";
        }
        }
    });
  }

  onClick() {
    if (!this.email || !this.password) {
      this.errorData = '請輸入帳號與密碼';
      return;
    }

    const loginReq = {
      email: this.email,
      password: this.password
    };

    // 呼叫你後端的 api/quiz/login
    this.apiService.postApi('api/quiz/login', loginReq).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          // 1. 存入 Auth 狀態 (res.name 與 res.admin 是你後端 LoginRes 的欄位)
          this.accountAuthService.setUser(res.name, res.admin);

          // 2. 關閉彈窗
          this.dialogRef.close("confirm");

          // 3. 根據權限跳轉
          if (res.admin) {
            this.router.navigate(['/questionnaire-manager']); // 管理員去後台
          } else {
            alert(`歡迎回來，${res.name}！`);
            // 一般使用者可以留在首頁，或是去歷史紀錄
          }
        } else {
          // 顯示後端傳回來的錯誤訊息 (例如：密碼錯誤)
          this.errorData = res.message;
        }
      },
      error: (err) => {
        this.errorData = '伺服器連線失敗';
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}

// 原本的寫法
  // onClick() {
  //   // 要傳遞資料出去就寫在close後面的()裡面
  //   // 不限格式 但是要注意接收的那邊宣告的格式要跟你傳遞出去的一樣
  //   if(this.account == 'qwer' && this.password == '12345') {
  //     this.dialogRef.close("confirm");
  //     this.router.navigateByUrl('/questionnaire-manager');
  //   }
  //   else{
  //     this.errorData = '帳號或密碼可能有錯誤';
  //   }
  // }

  // onNoClick() {
  //   // 我沒有要傳遞任何資料出去
  //   this.dialogRef.close();
  // }
