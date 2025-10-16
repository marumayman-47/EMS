import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Expense } from '../../models/expense';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css'
})
export class Expenses implements OnInit , AfterViewInit{

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  expenses: Expense[] = [];
  newExpense: Expense = { id: 0, eventId: 0, name: '', amount: 0, category: 'Venue', date: '', notes: '' };
  editExpense: Expense | null = null;
  
  pieChart!: Chart;

  ngOnInit(): void {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      this.expenses = JSON.parse(saved);
    } else {
      this.expenses = [
        { id: 401, eventId: 101, name: 'Venue Booking', amount: 5000, category: 'Venue', date: '2025-09-22', notes: 'Paid deposit' },
        { id: 402, eventId: 101, name: 'Decorations', amount: 1200, category: 'Decoration', date: '2025-10-05', notes: '' },
        { id: 403, eventId: 102, name: 'Catering', amount: 2500, category: 'Food', date: '2025-05-30', notes: 'Final payment done' },
      ];
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
    }
  }

  ngAfterViewInit(): void {
    this.renderPieChart();
  }

  saveToLocal() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
    this.renderPieChart();
  }

  addExpense() {
    if (!this.newExpense.name.trim() || this.newExpense.amount <= 0 || !this.newExpense.date) {
      alert('Please fill all required fields and make sure amount > 0');
      return;
    }
    this.newExpense.id = Date.now();
    this.expenses.push({ ...this.newExpense });
    this.saveToLocal();
    this.newExpense = { id: 0, eventId: 0, name: '', amount: 0, category: 'Venue', date: '', notes: '' };
  }

  startEdit(expense: Expense) { this.editExpense = { ...expense }; }
  saveEdit() {
    if (!this.editExpense || this.editExpense.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    const index = this.expenses.findIndex(e => e.id === this.editExpense!.id);
    if (index > -1) {
      this.expenses[index] = this.editExpense!;
      this.saveToLocal();
      this.editExpense = null;
    }
  }
  cancelEdit() { this.editExpense = null; }
  deleteExpense(id: number) { this.expenses = this.expenses.filter(e => e.id !== id); this.saveToLocal(); }

  getTotal(): number { return this.expenses.reduce((sum, e) => sum + e.amount, 0); }
  getCategoryTotal(cat: string) { return this.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0); }

  renderPieChart() {
    if (!this.pieCanvas) return;
    const categories = ['Venue', 'Decoration', 'Food', 'Music', 'Transport', 'Miscellaneous'];
    const data = categories.map(c => this.getCategoryTotal(c));

    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{ data, backgroundColor: ['#36A2EB','#FF6384','#FFCE56','#4BC0C0','#9966FF','#FF9F40'] }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Expenses by Category' } } }
    });
  }
}
