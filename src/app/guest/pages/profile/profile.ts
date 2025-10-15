import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: any = {};
  constructor(private router: Router)
  {}

  //get profile data
  ngOnInit(): void{
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser)
    {
      this.user = JSON.parse(currentUser);
    }else{
      this.router.navigate(['/login']);
    }
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.image = reader.result as string;
        this.saveUserChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  //update profile
  updateProfile():void{
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    alert("Profile updated successfully !");
  }

  //save changes
  
  private saveUserChanges(){
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: any) => u.id === this.user.id);
    if(index !== -1)
    {
      users[index] = this.user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  //logout
  logout():void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
