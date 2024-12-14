import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-product',
  imports: [RouterModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css'
})
export class ShowProductComponent implements OnInit {

  productData: any;

  constructor(
    private _ProductService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductData(productId);
    }
  }

 
  fetchProductData(productId: string): void {
    this._ProductService.getProductById(productId).subscribe({
      next: (response) => {
        console.log(response);
        this.productData = response|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Product data:', err.message);
      }
    });
  }
  
}