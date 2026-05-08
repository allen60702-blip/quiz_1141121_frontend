import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-confirm-1',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            FormsModule, ],
  templateUrl: './confirm-1.component.html',
  styleUrl: './confirm-1.component.scss'
})
export class Confirm1Component {
  inputAns!: string;
  textareaAns!: string;

}
