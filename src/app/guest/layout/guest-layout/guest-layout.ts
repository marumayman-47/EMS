import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-guest-layout',
  imports: [RouterModule, Navbar, Footer],
  templateUrl: './guest-layout.html',
  styleUrl: './guest-layout.css'
})
export class GuestLayout {

}
