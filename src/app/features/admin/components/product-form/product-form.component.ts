import { Component, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryResponse, ProductResponse, UpsertProductRequest } from '../../../../core/models/product';
import { AdminProductService } from '../../services/admin-product.service';
import { CategoryService } from '../../../../core/services/category/category.services';

type UpsertProductFormControls = {
  name: FormControl<string>;
  stock: FormControl<number>;
  price: FormControl<number>;
  categoryId: FormControl<number>;
  isActive: FormControl<boolean>;
  imageUrl: FormControl<string | null>;
};

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class AdminProductFormComponent implements OnInit {
  /** Nếu edit: truyền product vào từ parent */
  @Input() editingProduct: ProductResponse | null = null;

  categories = signal<CategoryResponse[]>([]);
  saving = signal(false);
  uploading = signal(false);
  uploadProgress = signal<number>(0);
  error = signal<string | null>(null);

  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  form!: FormGroup<UpsertProductFormControls>;


  constructor(private fb: FormBuilder,
    private adminProduct: AdminProductService,
    private categoryService: CategoryService) {
      this.form = this.fb.nonNullable.group({
        name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
        stock: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
        price: this.fb.nonNullable.control(1, [Validators.required, Validators.min(0.01)]),
        categoryId: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
        isActive: this.fb.control<boolean>(true),
        imageUrl: this.fb.control<string | null>(null), // option backend url
      }) as FormGroup<UpsertProductFormControls>;

  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.editingProduct) {
      const p = this.editingProduct;
      this.form.patchValue({
        name: p.name,
        stock: p.stock,
        price: p.price,
        categoryId: p.categoryId,
        isActive: p.isActive,
        imageUrl: p.imageUrl ?? null,
      });

      // preview: nếu có imageUrl thì show luôn
      this.previewUrl.set(p.imageUrl ?? null);
    } else {
      this.previewUrl.set(this.form.value.imageUrl ?? null);
    }
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Load categories failed', err);
      },
    });
  }

  onPickFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;
    this.error.set(null);

    if (!file) {
      this.previewUrl.set(this.form.value.imageUrl ?? null);
      return;
    }

    // client preview
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl.set(typeof reader.result === 'string' ? reader.result : null));
    reader.readAsDataURL(file);
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl.set(this.form.value.imageUrl ?? null);
    this.uploadProgress.set(0);
    this.error.set(null);
  }

  submit(): void {
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Form invalid. Check fields.');
      return;
    }

    // Option B: nếu có file mới -> upload trước
    if (this.selectedFile) {
      this.uploadThenSave(this.selectedFile);
      return;
    }

    // không upload -> save luôn (giữ imageUrl hiện tại hoặc null)
    this.saveProduct();
  }

  private uploadThenSave(file: File): void {
    this.uploading.set(true);
    this.uploadProgress.set(0);

    this.adminProduct.uploadImageWithProgress(file).subscribe({
      next: (state) => {
        this.uploadProgress.set(state.progress);

        if (state.url) {
          // set imageUrl vào form rồi save
          this.form.patchValue({ imageUrl: state.url });
          this.selectedFile = null; // file đã lên xong
          this.uploading.set(false);
          this.saveProduct();
        }
      },
      error: (err: unknown) => {
        this.uploading.set(false);
        this.error.set(this.extractErr(err) ?? 'Upload failed');
      },
    });
  }

  private saveProduct(): void {
    this.saving.set(true);

    const raw = this.form.getRawValue();
    const req: UpsertProductRequest = {
      name: raw.name,
      stock: raw.stock,
      price: raw.price,
      categoryId: raw.categoryId,
      isActive: raw.isActive ?? true,
      imageUrl: raw.imageUrl ?? null,
    };

    const done = () => this.saving.set(false);

    if (this.editingProduct) {
      this.adminProduct.update(this.editingProduct.id, req).subscribe({
        next: (p) => {
          done();
          this.previewUrl.set(p.imageUrl ?? null);
          this.form.patchValue({ imageUrl: p.imageUrl ?? null });
        },
        error: (err: unknown) => {
          done();
          this.error.set(this.extractErr(err) ?? 'Update failed');
        },
      });
    } else {
      this.adminProduct.create(req).subscribe({
        next: (p) => {
          done();
          this.previewUrl.set(p.imageUrl ?? null);
          this.form.patchValue({ imageUrl: p.imageUrl ?? null });
        },
        error: (err: unknown) => {
          done();
          this.error.set(this.extractErr(err) ?? 'Create failed');
        },
      });
    }
  }

  private extractErr(err: unknown): string | null {
    // strict-safe error parsing
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object' && 'error' in err) {
      const e = (err as { error?: unknown }).error;
      if (typeof e === 'string') return e;
      if (e && typeof e === 'object' && 'message' in e) {
        const msg = (e as { message?: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
    }
    return null;
  }
}
