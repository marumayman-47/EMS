import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css']
})
export class AdminReports implements OnInit {
  totalEvents = 0;
  totalUsers = 0;
  totalGuests = 0;
  averageFeedback = 0;

  // Pie chart for expenses
  expenseLabels: string[] = [];
  expenseData: number[] = [];

  // Bar chart for events per month
  monthLabels: string[] = [];
  monthData: number[] = [];

  // Chart configs
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Events by Month' },
    },
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#14b8a6',
        ],
      },
    ],
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Events', backgroundColor: '#3b82f6' },
    ],
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const guests = JSON.parse(localStorage.getItem('guests') || '[]');
    const feedback = JSON.parse(localStorage.getItem('feedback') || '[]'); 
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

    // Totals
    this.totalEvents = events.length;
    this.totalUsers = users.length;
    this.totalGuests = guests.length;

    // Average feedback
    const validFeedback = feedback.filter((f: any) => f.rating && f.rating > 0);
    if (validFeedback.length > 0) {
      const sum = validFeedback.reduce((acc: number, f: any) => acc + f.rating, 0);
      this.averageFeedback = +(sum / validFeedback.length).toFixed(1);
    } else {
      this.averageFeedback = 0;
    }

    // Expense breakdown
    const categoryTotals: { [key: string]: number } = {};
    for (const exp of expenses) {
      const category = exp.category || 'Other';
      if (!categoryTotals[category]) categoryTotals[category] = 0;
      categoryTotals[category] += Number(exp.amount) || 0;
    }

    this.expenseLabels = Object.keys(categoryTotals);
    this.expenseData = Object.values(categoryTotals);

    this.pieChartData.labels = this.expenseLabels;
    this.pieChartData.datasets[0].data = this.expenseData;

    // Events by month
    const monthlyCount: { [key: string]: number } = {};
    for (const e of events) {
      const month = new Date(e.startDate).toLocaleString('default', { month: 'short' });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;
    }

    this.monthLabels = Object.keys(monthlyCount);
    this.monthData = Object.values(monthlyCount);

    this.barChartData.labels = this.monthLabels;
    this.barChartData.datasets[0].data = this.monthData;
  }
}
