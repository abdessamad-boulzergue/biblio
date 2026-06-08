import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from '../../../../core/services/article.service';
import { CategoryService } from '../../../../core/services/category.service';
import { FileService } from '../../../../core/services/file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  categories: any[] = [];
  statuses = ['ACTIF', 'INACTIF', 'EN_RUPTURE'];
  mainImageUrl: string = '';
  galleryUrls: string[] = [];
  editMode: boolean = false;
  articleId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      sku: ['', Validators.required],
      priceHT: [0, [Validators.required, Validators.min(0)]],
      taxRate: [20, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      shortDescription: [''],
      longDescription: [''],
      weight: [0],
      dimensions: [''],
      status: ['ACTIF', Validators.required],
      category: [null]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(data => this.categories = data);
    
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.articleId = +id;
        this.articleService.getById(this.articleId).subscribe(article => {
          this.articleForm.patchValue({
            title: article.title,
            sku: article.sku,
            priceHT: article.priceHT,
            taxRate: article.taxRate,
            stockQuantity: article.stockQuantity,
            shortDescription: article.shortDescription,
            longDescription: article.longDescription,
            weight: article.weight,
            dimensions: article.dimensions,
            status: article.status,
            category: article.category?.id
          });
          this.mainImageUrl = article.mainImage || '';
          this.galleryUrls = article.images || [];
        });
      }
    });
  }

  onMainImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileService.uploadFile(file).subscribe(res => {
        this.mainImageUrl = res.fileUrl;
      });
    }
  }

  onGalleryImagesSelected(event: any): void {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fileService.uploadFile(files[i]).subscribe(res => {
        this.galleryUrls.push(res.fileUrl);
      });
    }
  }

  removeGalleryImage(index: number): void {
    this.galleryUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.articleForm.valid) {
      const payload = {
        ...this.articleForm.value,
        category: { id: this.articleForm.value.category },
        mainImage: this.mainImageUrl,
        images: this.galleryUrls
      };

      if (this.editMode && this.articleId) {
        this.articleService.update(this.articleId, payload).subscribe({
          next: () => {
            this.snackBar.open('Article mis à jour', 'OK', { duration: 3000 });
            this.router.navigate(['/admin/articles']);
          },
          error: (err) => {
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.articleService.create(payload).subscribe({
          next: () => {
            this.snackBar.open('Article enregistré', 'OK', { duration: 3000 });
            this.router.navigate(['/admin/articles']);
          },
          error: (err) => {
            this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }
}
