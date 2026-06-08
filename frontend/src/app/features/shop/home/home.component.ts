import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { CartService } from '../../../core/services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredArticles: any[] = [];

  constructor(
    private articleService: ArticleService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Load first 8 articles as featured
    this.articleService.getAll(0, 8).subscribe({
      next: (data: any) => {
        this.featuredArticles = data.content;
      },
      error: (err: any) => {
        console.error('Error fetching articles', err);
      }
    });
  }

  addToCart(article: any): void {
    this.cartService.addToCart(article, 1);
    this.snackBar.open(article.title + ' ajouté au panier !', 'Voir le panier', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
