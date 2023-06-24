import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';

import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss']
})
export class WorkerComponent {

  public workerInfo$: Observable<any>;

  public chartData$: Observable<any>;

  public chartOptions: any;

  constructor(private workerService: WorkerService, private route: ActivatedRoute) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.workerInfo$ = this.workerService.getWorkerInfo(this.route.snapshot.params['address'], this.route.snapshot.params['workerName'], this.route.snapshot.params['workerId']).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    )

    this.chartData$ = this.workerInfo$.pipe(
      map((workerInfo: any) => {

        return {
          labels: workerInfo.chartData.map((d: any) => d.label),
          datasets: [
            {
              label: workerInfo.name,
              data: workerInfo.chartData.map((d: any) => d.data),
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
              borderColor: documentStyle.getPropertyValue('--bluegray-700'),
              tension: .4
            }
          ]
        }
      })
    );



    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute', // Set the unit to 'minute'
            stepSize: 10, // Set the desired interval between labels in minutes

          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => value + ' GH/s',
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }



}
