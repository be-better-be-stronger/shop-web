
import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';
import { UpsertProductRequest, ProductResponse } from '../../../../core/models/product';
import { CatalogApiService } from '../../../../core/services/catalog-api.service';
import { Category } from '../../../../core/models/category';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class AdminProductFormComponent implements OnChanges {

  private fb = inject(FormBuilder);
  private productService = inject(AdminProductService);
  private catalogService = inject(CatalogApiService);

  /** nếu id có giá trị => edit mode, nếu null => create mode */
  @Input() productId: number | null = null;

  /** nếu edit mode, truyền product detail vào để patch form (có thể lấy từ API detail) */
  @Input() product: ProductResponse | null = null;

  uploading = signal(false);
  saving = signal(false);

  // lưu url trả từ backend
  imageUrl: string | null = null;

  // preview ảnh trên UI (local hoặc public)
previewUrl = signal<string | null>(null);

  msg: string | null = null;
  err: string | null = null;

  // demo categories (sau này mày thay bằng API categories)
  categories: Category[] = [];
  ngOnInit() {
    this.catalogService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    stock: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(0.01)]],
    categoryId: [1, [Validators.required, Validators.min(1)]],
    isActive: [true],
  });

  ngOnChanges(changes: SimpleChanges): void {
    // Khi nhận product detail (edit) => patch form
    if (changes['product'] && this.product) {
      // ProductResponse của mày có thể khác, tự map field cho khớp
      // giả sử ProductResponse có các field giống entity/DTO:
      this.form.patchValue({
        name: (this.product as any).name ?? '',
        description: (this.product as any).description ?? '',
        stock: (this.product as any).stock ?? 1,
        price: (this.product as any).price ?? 1,
        categoryId: (this.product as any).categoryId ?? 1,
        isActive: (this.product as any).isActive ?? true,
      });

      const url = (this.product as any).imageUrl as string | undefined;
      this.imageUrl = url ?? null;
      this.previewUrl.set(url ?? null);
    }
  }

  onPickImage(ev: Event) {
    this.msg = null;
    this.err = null;

    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // preview local ngay lập tức
    this.previewUrl.set(URL.createObjectURL(file));

    // upload để lấy public url
    this.uploading.set(true);
    this.productService.uploadImage(file).subscribe({
      next: (url) => {
        this.imageUrl = url;     // "/uploads/products/uuid.jpg"
        this.previewUrl.set(`http://localhost:8080${url}`);   // cho preview bằng public url (nếu muốn)
        this.uploading.set(false);
        this.msg = 'Upload image ok';
      },
      error: (e) => {
        this.uploading.set(false);
        this.err = this.pickErr(e) ?? 'Upload failed';
        this.imageUrl = null;
      },
    });
  }

  submit() {
    this.msg = null;
    this.err = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.err = 'Form invalid';
      return;
    }

    const v = this.form.getRawValue();

    const req: UpsertProductRequest = {
      name: v.name!,
      stock: Number(v.stock),
      price: Number(v.price),
      categoryId: Number(v.categoryId),
      isActive: !!v.isActive,
      imageUrl: this.imageUrl ?? undefined,
      description: v.description ?? null,
    };

    this.saving.set(true);

    const obs = this.productId
      ? this.productService.update(this.productId, req)
      : this.productService.create(req);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.msg = this.productId ? 'Updated product ok' : 'Created product ok';

        if (!this.productId) {
          // create xong thì reset nhẹ
          this.form.reset({
            name: '',
            description: '',
            stock: 1,
            price: 1,
            categoryId: 1,
            isActive: true,
          });
          this.imageUrl = null;
          this.previewUrl.set(null);
        }
      },
      error: (e) => {
        this.saving.set(false);
        this.err = this.pickErr(e) ?? 'Save failed';
      },
    });
  }

  disable() {
    if (!this.productId) return;

    this.msg = null;
    this.err = null;
    this.saving.set(true);

    this.productService.disable(this.productId).subscribe({
      next: () => {
        this.saving.set(false);
        this.msg = 'Disabled product ok';
        this.form.patchValue({ isActive: false });
      },
      error: (e) => {
        this.saving.set(false);
        this.err = this.pickErr(e) ?? 'Disable failed';
      },
    });
  }



  private pickErr(e: any): string | null {
    // tùy format ApiResponse / exception của mày
    return e?.error?.message ?? e?.error?.error ?? null;
  }
}
