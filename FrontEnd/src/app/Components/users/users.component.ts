import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: any[] = []; 
  filteredUsers: any[] = [];  
  searchQuery: string = ''; 

  constructor(private _UserServicev: UserService, private router: Router,private toastr:ToastrService ) {}

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers(): void {
    this._UserServicev.viewAllUsers().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.users = response.data; 
          this.filteredUsers = this.users;
         
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCities = this.users.filter(city =>
  //     city.city.toLowerCase().includes(query) || city.country.toLowerCase().includes(query)
  //   );
  // }

  deleteUser(userId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟')) {
        this._UserServicev.deleteUser(userId).subscribe({
            next: (response) => {
                if (response) {
                    this.router.navigate(['/dashboard/users']);
                    this.toastr.success("تم حذف المستخدم بنجاح");
                    this.loadUsers();
                }
            },
            error: (err) => {
                console.error(err);
                alert('حدث خطأ أثناء حذف المستخدم.');
            }
        });
    }
}

}
