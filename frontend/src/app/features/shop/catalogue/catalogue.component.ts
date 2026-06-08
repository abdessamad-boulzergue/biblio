import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatSnackBarModule, FormsModule, RouterModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  articles: any[] = [];
  categories: any[] = [];
  searchKeyword: string = '';
  selectedCategoryId: number | null = null;
  
  pageIndex = 0;
  pageSize = 20;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadArticles();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((data: any) => this.categories = data);
  }

  loadArticles(): void {
    this.articleService.getAll(this.pageIndex, this.pageSize, this.searchKeyword, this.selectedCategoryId)
      .subscribe((data: any) => {
        this.articles = data.content;
      });
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadArticles();
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.pageIndex = 0;
    this.loadArticles();
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
