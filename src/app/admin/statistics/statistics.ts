import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { AdminStatisticsService } from '../../service/AdminStatisticsService';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.html',
  imports: [CommonModule]
})
export class StatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild('courseChart')      courseChart!: ElementRef;
  @ViewChild('incomePlanChart')  incomePlanChart!: ElementRef;
  @ViewChild('studentPlanChart') studentPlanChart!: ElementRef;
  @ViewChild('incomeMonthChart') incomeMonthChart!: ElementRef;

  tabActivo: 'ingresos' | 'planes' | 'cursos' = 'ingresos';

  private charts: { [key: string]: Chart } = {};

  constructor(private statsService: AdminStatisticsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadAllCharts();
  }

  private destroyChart(key: string) {
    if (this.charts[key]) {
      this.charts[key].destroy();
      delete this.charts[key];
    }
  }

  loadAllCharts() {
    this.loadCourses();
    this.loadIncomeByPlan();
    this.loadStudentsByPlan();
    this.loadIncomeByMonth();
  }

  loadCourses() {
    this.statsService.getMostViewedCourses().subscribe(res => {
      this.destroyChart('courses');
      this.charts['courses'] = new Chart(this.courseChart.nativeElement, {
        type: 'bar',
        data: {
          labels: res.data.map(d => d.title),
          datasets: [{
            label: 'Vistas',
            data: res.data.map(d => d.totalViews),
            backgroundColor: '#3b82f6',
            borderRadius: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          indexAxis: 'y',
          plugins: { legend: { display: false } }
        }
      });
    });
  }

  loadIncomeByPlan() {
    this.statsService.getIncomeByPlan().subscribe(res => {
      this.destroyChart('incomePlan');
      this.charts['incomePlan'] = new Chart(this.incomePlanChart.nativeElement, {
        type: 'pie',
        data: {
          labels: res.data.map(d => d.plan),
          datasets: [{
            data: res.data.map(d => d.totalIncome),
            backgroundColor: ['#a855f7', '#22d3ee', '#64748b']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          plugins: { legend: { position: 'bottom' } }
        }
      });
    });
  }

  loadStudentsByPlan() {
    this.statsService.getStudentsByPlan().subscribe(res => {
      this.destroyChart('studentPlan');
      this.charts['studentPlan'] = new Chart(this.studentPlanChart.nativeElement, {
        type: 'bar',
        data: {
          labels: res.data.map(d => d.plan),
          datasets: [{
            label: 'Estudiantes',
            data: res.data.map(d => d.totalStudents),
            backgroundColor: '#22d3ee',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,  
          plugins: { legend: { display: false } }
        }
      });
    });
  }

  loadIncomeByMonth() {
    this.statsService.getIncomeByMonth().subscribe(res => {
      this.destroyChart('incomeMonth');
      this.charts['incomeMonth'] = new Chart(this.incomeMonthChart.nativeElement, {
        type: 'line',
        data: {
          labels: res.data.map(d => this.getMonthName(d.month)),
          datasets: [{
            label: 'Ingresos',
            data: res.data.map(d => d.totalIncome),
            borderColor: '#22d3ee',
            backgroundColor: 'rgba(34,211,238,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#22d3ee'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,  
          plugins: { legend: { display: false } }
        }
      });
    });
  }

  getMonthName(month: number): string {
    const months = ['Ene','Feb','Mar','Abr','May','Jun',
                    'Jul','Ago','Sep','Oct','Nov','Dic'];
    return months[month - 1];
  }
}