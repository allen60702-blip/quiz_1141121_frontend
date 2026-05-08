import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Chart from 'chart.js/auto';
import { MatDialog } from '@angular/material/dialog';
import { Dialog2Component } from '../../@dialog/dialog-2/dialog-2.component';

@Component({
  selector: 'app-question-1',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            FormsModule, Dialog2Component,
  ],
  templateUrl: './question-1.component.html',
  styleUrl: './question-1.component.scss'
})
export class Question1Component {

  inputName!: string;
  inputCell!: string;
  inputEmail!: string;
  inputAge!: number;
  inputAns!: string;
  textareaAns!: string;

  readonly dialog2 = inject(MatDialog);

  openDialog() {
    let dialogRef = this.dialog2.open(Dialog2Component, {
      width: '300px',
      height: '300px',
    });

    // 我等待我開啟的這個dialog(dialogRef) 等她關閉(afterClosed())
    dialogRef.afterClosed().subscribe((res) => {
      // 判斷如果丟出來的內容有值 如果沒有值會是undefind
      if(res) {
        console.log(res);
      }
    });
  }

}
