import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// import { NgChartsModule } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportSection') reportSection!: ElementRef;

  totalEvents = 0;
  upcomingEvents = 0;
  completedEvents = 0;
  totalGuests = 0;
  totalExpenses = 0;
  avgFeedback = 0;

  pieChart!: Chart;
  barChart!: Chart;
  lineChart!: Chart;

  ngOnInit(): void {
    this.calculateStats();
    this.setupRealtimeUpdates();
  }

  getData(key: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  calculateStats() {
    const events = this.getData('events');
    const guests = this.getData('guests');
    const expenses = this.getData('expenses');
    const feedback = this.getData('feedback');

    this.totalEvents = events.length;
    this.upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
    this.completedEvents = events.filter(e => e.status === 'Completed').length;
    this.totalGuests = guests.length;
    this.totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const validFeedbacks = feedback.filter((f: any) => f.rating > 0);
    this.avgFeedback = validFeedbacks.length
      ? +(validFeedbacks.reduce((a, f) => a + f.rating, 0) / validFeedbacks.length).toFixed(1)
      : 0;
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  setupRealtimeUpdates() {
    setInterval(() => {
      this.calculateStats();
      this.updateCharts();
    }, 3000);
  }

  updateCharts() {
    this.pieChart.destroy();
    this.barChart.destroy();
    this.lineChart.destroy();
    this.renderCharts();
  }

  renderCharts() {
    const events = this.getData('events');
    const expenses = this.getData('expenses');

    // --- PIE CHART (Expenses by Category) ---
    const categories = [...new Set(expenses.map((e: any) => e.category || 'Other'))];
    const data = categories.map(cat =>
      expenses.filter((e: any) => e.category === cat).reduce((sum, e) => sum + (e.amount || 0), 0)
    );

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            data,
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Expenses by Category' } }
      }
    });

    // --- BAR CHART (Events per Month) ---
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('en', { month: 'short' })
    );

    const upcomingCounts = months.map((_, i) =>
      events.filter(
        (e: any) => new Date(e.startDate).getMonth() === i && e.status === 'Upcoming'
      ).length
    );
    const completedCounts = months.map((_, i) =>
      events.filter(
        (e: any) => new Date(e.startDate).getMonth() === i && e.status === 'Completed'
      ).length
    );

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Upcoming Events',
            data: upcomingCounts,
            backgroundColor: 'rgba(13, 110, 253, 0.7)',
            borderColor: '#0d6efd',
            borderWidth: 1
          },
          {
            label: 'Completed Events',
            data: completedCounts,
            backgroundColor: 'rgba(25, 135, 84, 0.7)',
            borderColor: '#198754',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Events by Month' },
          legend: { position: 'bottom' }
        }
      }
    });

    // --- LINE CHART (Progress Trend) ---
    const lineData = months.map((_, i) =>
      events.filter(
        (e: any) => new Date(e.startDate).getMonth() === i && e.status === 'Completed'
      ).length * 25
    );

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Progress Trend (%)',
            data: lineData,
            borderColor: '#28a745',
            tension: 0.3,
            fill: true,
            backgroundColor: 'rgba(40,167,69,0.1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Progress Trend' } }
      }
    });
  }

  // 🧾 Export Report as PDF
  exportPDF() {
    const element = this.reportSection.nativeElement;
    html2canvas(element, { scale: 2 }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Event-Reports.pdf');
    });
  }

}


