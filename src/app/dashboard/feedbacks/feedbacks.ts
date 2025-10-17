import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../models/feedback';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedbacks.html',
  styleUrl: './feedbacks.css'
})
export class Feedbacks implements OnInit{

  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  selectedRating: string = '';
  viewFeedbackObj: Feedback | null = null;

  ngOnInit(): void {
    const saved = localStorage.getItem('feedbacks');
    if (saved) {
      this.feedbacks = JSON.parse(saved);
    } else {
      this.feedbacks = [
        { id: 501, guestId: 201, eventId: 101, rating: 0, comment: '', createdAt: '' },
        { id: 502, guestId: 203, eventId: 102, rating: 5, comment: 'Amazing event! Everything was perfect.', createdAt: '2025-06-02' },
      ];
      localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
    this.filteredFeedbacks = this.feedbacks;
  }

  applyFilter() {
    if (this.selectedRating) {
      this.filteredFeedbacks = this.feedbacks.filter(f => f.rating === +this.selectedRating);
    } else {
      this.filteredFeedbacks = this.feedbacks;
    }
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbacks = this.feedbacks.filter(f => f.id !== id);
      this.filteredFeedbacks = this.filteredFeedbacks.filter(f => f.id !== id);
      localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
  }

   viewFeedback(feedback: Feedback) {
    this.viewFeedbackObj = feedback;
  }
}


