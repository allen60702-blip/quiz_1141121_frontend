import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-2',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            MatDialogActions, MatDialogTitle, MatDialogContent, MatDialogModule,
            FormsModule, ],
  templateUrl: './dialog-2.component.html',
  styleUrl: './dialog-2.component.scss'
})
export class Dialog2Component {
  readonly dialogRef = inject(MatDialogRef<Dialog2Component>);
  readonly data = inject(MAT_DIALOG_DATA);

  onClick() {
    // 要傳遞資料出去就寫在close後面的()裡面
    // 不限格式 但是要注意接收的那邊宣告的格式要跟你傳遞出去的一樣
    // 傳回 confirm 字串，讓 Question2Component 知道要啟動 API
    this.dialogRef.close("confirm");
  }

  onNoClick() {
    // 不傳任何值表示取消
    this.dialogRef.close();
  }

}
