import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../../core/services/article.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatPaginatorModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  displayedColumns: string[] = ['sku', 'title', 'priceHT', 'stockQuantity', 'status', 'category', 'actions'];
  dataSource: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAll(this.pageIndex, this.pageSize).subscribe((data: any) => {
      this.dataSource = data.content;
      this.totalElements = data.totalElements;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadArticles();
  }

  deleteArticle(id: number): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.delete(id).subscribe(() => {
        this.loadArticles();
      });
    }
  }
}
