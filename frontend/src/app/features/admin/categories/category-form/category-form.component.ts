import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../core/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  parentCategories: any[] = [];
  editMode: boolean = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      parentCategory: [null]
    });
  }

  ngOnInit(): void {
    // We can fetch all categories or just tree to use as parent
    this.categoryService.getAll().subscribe(data => {
      this.parentCategories = data;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.categoryId = +id;
        this.categoryService.getById(this.categoryId).subscribe((cat: any) => {
          this.categoryForm.patchValue({
            name: cat.name,
            description: cat.description,
            parentCategory: cat.parentCategory?.id
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const payload = { ...this.categoryForm.value };
      if (payload.parentCategory) {
        payload.parentCategory = { id: payload.parentCategory };
      }

      if (this.editMode && this.categoryId) {
        this.categoryService.update(this.categoryId, payload).subscribe({
          next: () => {
            this.snackBar.open('Catégorie mise à jour', 'OK', { duration: 3000 });
            this.router.navigate(['/admin/categories']);
          },
          error: (err) => {
            this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.categoryService.create(payload).subscribe({
          next: () => {
            this.snackBar.open('Catégorie créée', 'OK', { duration: 3000 });
            this.router.navigate(['/admin/categories']);
          },
          error: (err) => {
            this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }
}
