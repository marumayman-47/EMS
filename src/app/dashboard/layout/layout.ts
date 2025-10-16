import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarDashboard } from '../../components/navbar-dashboard/navbar-dashboard';
import { SidebarDashboard } from '../../components/sidebar-dashboard/sidebar-dashboard';

@Component({
  selector: 'app-layout',
  standalone: true, 
  imports: [CommonModule, RouterOutlet, NavbarDashboard, SidebarDashboard],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
