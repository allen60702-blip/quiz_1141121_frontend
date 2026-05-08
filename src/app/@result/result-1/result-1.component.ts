import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-result-1',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // 移除 CommonModule
  templateUrl: './result-1.component.html',
  styleUrl: './result-1.component.scss'
})
export class Result1Component implements AfterViewInit {

  chartArray = [
    {
      id: '1',
      labels: ['05:00~07:00', '07:00~09:00', '09:00~11:00'],
      label: '數據量',
      data: [20, 60, 10],
      backgroundColor: ['rgba(164, 162, 22, 1)', 'rgba(22, 93, 164, 1)', 'rgba(53, 17, 58, 1)']
    },
    {
      id: '2',
      labels: ['蛋餅', '蘿蔔糕', '漢堡', '煎餃', '飯糰', '燒餅油條', '鐵板麵', '其他'],
      label: '數據量',
      data: [5, 3, 2, 1, 2, 4, 1, 1],
      backgroundColor: ['rgba(65, 164, 22, 1)', 'rgba(34, 39, 43, 1)', 'rgba(234, 77, 255, 1)',
                        'rgba(240, 225, 68, 1)', 'rgba(235, 107, 28, 1)', 'rgba(227, 33, 220, 1)',
                        'rgba(35, 220, 220, 1)', 'rgba(38, 23, 156, 1)',
      ]
    }
  ];

  questionArray = [
    { id: 1, questionName: '您通常吃早餐的時間點為何(單選)', type: 'Q' },
    { id: 2, questionName: '您通常選擇的早餐為何(多選)', type: 'M' },
    { id: 3, questionName: '您對臺灣的早餐類型有何看法', type: 'T' }
  ];

  // 檢查該 ID 是否有圖表資料
  getChartData(id: number) {
    return this.chartArray.find(c => Number(c.id) === id);
  }

  ngAfterViewInit() {
    this.chartArray.forEach(chartData => {
      const canvas = document.getElementById(`canvas-${chartData.id}`) as HTMLCanvasElement;
      if (canvas) {
        new Chart(canvas, {
          type: 'pie',
          data: {
            labels: chartData.labels,
            datasets: [{
              label: chartData.label,
              data: chartData.data,
              backgroundColor: chartData.backgroundColor,
              hoverOffset: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    });
  }
}
