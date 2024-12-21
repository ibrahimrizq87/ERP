import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products: any[] = []; 
  filteredProducts: any[] = [];  
  searchQuery: string = ''; 

  constructor(private _ProductService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts(); 
  }

  loadProducts(): void {
    this._ProductService.viewAllProducts().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.products = response; 
          this.filteredProducts = response;
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase(); // Convert to lowercase for case-insensitive search
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.price.toString().includes(query) || 
      product.amount.toString().includes(query)
    );
  }
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCities = this.users.filter(city =>
  //     city.city.toLowerCase().includes(query) || city.country.toLowerCase().includes(query)
  //   );
  // }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this Product?')) {
      this._ProductService.deleteProduct(productId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/products']);
            this.loadProducts();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the product.');
        }
      });
    }
  }
}