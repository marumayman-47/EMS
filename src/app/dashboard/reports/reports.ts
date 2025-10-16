import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { mockEvents, mockExpenses, mockFeedback, mockGuests } from '../../data/mock-data';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reportSection') reportSection!: ElementRef;

  // Summary values
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

  calculateStats() {
    this.totalEvents = mockEvents.length;
    this.upcomingEvents = mockEvents.filter(e => e.status === 'Upcoming').length;
    this.completedEvents = mockEvents.filter(e => e.status === 'Completed').length;
    this.totalGuests = mockGuests.length;
    this.totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
    const feedbacks = mockFeedback.filter(f => f.rating > 0);
    this.avgFeedback = feedbacks.length
      ? +(feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;
  }

  ngAfterViewInit(): void {
    this.renderPieChart();
    this.renderBarChart();
    this.renderLineChart();
  }

  // Real-time updates (poll localStorage every 3 seconds)
  setupRealtimeUpdates() {
    setInterval(() => {
      const tasks = localStorage.getItem('tasks');
      const expenses = localStorage.getItem('expenses');
      if (tasks || expenses) {
        this.calculateStats();
        this.updateCharts();
      }
    }, 3000);
  }

  updateCharts() {
    this.pieChart.destroy();
    this.barChart.destroy();
    this.lineChart.destroy();
    this.renderPieChart();
    this.renderBarChart();
    this.renderLineChart();
  }

  renderPieChart() {
    const categories = [...new Set(mockExpenses.map(e => e.category))];
    const data = categories.map(cat =>
      mockExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    );

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{ data, backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#20c997'] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: 'Expenses by Category' } }
      }
    });
  }

  renderBarChart() {
    const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('en', { month: 'short' })
    );

    // Count upcoming and completed per month
  const upcomingCounts = months.map((_, i) =>
    mockEvents.filter(
      e => new Date(e.startDate).getMonth() === i && e.status === 'Upcoming'
    ).length
  );

  const completedCounts = months.map((_, i) =>
    mockEvents.filter(
      e => new Date(e.startDate).getMonth() === i && e.status === 'Completed'
    ).length
  );

    // Draw chart
  this.barChart = new Chart(this.barCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Upcoming Events',
          data: upcomingCounts,
          backgroundColor: 'rgba(13, 110, 253, 0.7)', // Bootstrap blue
          borderColor: '#0d6efd',
          borderWidth: 1
        },
        {
          label: 'Completed Events',
          data: completedCounts,
          backgroundColor: 'rgba(25, 135, 84, 0.7)', // Bootstrap green
          borderColor: '#198754',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Events by Month', font: { size: 18 } },
        legend: { position: 'bottom' }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#333' }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}

  renderLineChart() {
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' }));
    const data = months.map((m, i) =>
      mockEvents.filter(e => new Date(e.startDate).getMonth() === i && e.status === 'Completed').length * 25
    );

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Progress Trend (%)',
          data,
          borderColor: '#28a745',
          tension: 0.3,
          fill: true,
          backgroundColor: 'rgba(40,167,69,0.1)'
        }]
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
