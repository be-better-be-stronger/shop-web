import { Component, inject, Input, OnChanges, OnInit, OnDestroy, signal, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';
import { UpsertProductRequest, ProductResponse } from '../../../../core/models/product';
import { CatalogApiService } from '../../../../core/services/catalog-api.service';
import { Category } from '../../../../core/models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class AdminProductFormComponent implements OnChanges, OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private productService = inject(AdminProductService);
  private catalogService = inject(CatalogApiService);
  private route = inject(ActivatedRoute);

  @Input() productId: number | null = null;
  @Input() product: ProductResponse | null = null;

  uploading = signal(false);
  saving = signal(false);

  imageUrl: string | null = null;
  previewUrl = signal<string | null>(null);

  msg: string | null = null;
  err: string | null = null;

  categories: Category[] = [];

  private localObjectUrl: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    stock: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(0.01)]],
    categoryId: [null as number | null, [Validators.required]],
    isActive: [true],
  });

  ngOnInit() {
    if (this.productId) {
      this.catalogService.getProductById(this.productId)
        .subscribe(p => this.product = p);
    }

    this.catalogService.getCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
        // nếu đang create mode và chưa chọn category -> set default theo list
        const current = this.form.get('categoryId')!.value;
        if (!this.productId && (current == null) && this.categories.length > 0) {
          this.form.patchValue({ categoryId: (this.categories[0] as any).id ?? null });
        }
      },
      error: (err) => console.error(err),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.form.patchValue({
        name: this.product.name ?? '',
        description: (this.product as any).description ?? '',
        stock: (this.product as any).stock ?? 1,
        price: (this.product as any).price ?? 1,
        categoryId: (this.product as any).categoryId ?? null,
        isActive: (this.product as any).isActive ?? true,
      });

      const url = (this.product as any).imageUrl as string | undefined;
      this.imageUrl = url ?? null;
      this.setPreview(url ? this.toPublicUrl(url) : null, /*isLocal*/ false);
    }
  }

  ngOnDestroy(): void {
    this.revokeLocalUrl();
  }

  onPickImage(ev: Event) {
    this.msg = null;
    this.err = null;

    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // preview local ngay lập tức
    const localUrl = URL.createObjectURL(file);
    this.setPreview(localUrl, /*isLocal*/ true);

    // upload để lấy public url
    this.uploading.set(true);
    this.productService.uploadImage(file).subscribe({
      next: (url) => {
        this.imageUrl = url;
        this.setPreview(this.toPublicUrl(url), /*isLocal*/ false);
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

    if (this.uploading()) {
      this.err = 'Đang upload ảnh, chờ upload xong rồi lưu.';
      return;
    }

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
          const defaultCatId = this.categories?.[0] ? (this.categories[0] as any).id ?? null : null;

          this.form.reset({
            name: '',
            description: '',
            stock: 1,
            price: 1,
            categoryId: defaultCatId,
            isActive: true,
          });

          this.imageUrl = null;
          this.setPreview(null, false);
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

  private setPreview(url: string | null, isLocal: boolean) {
    if (isLocal) {
      this.revokeLocalUrl();
      this.localObjectUrl = url;
    } else {
      // nếu chuyển qua public url thì local url trước đó không cần nữa
      this.revokeLocalUrl();
    }
    this.previewUrl.set(url);
  }

  private revokeLocalUrl() {
    if (this.localObjectUrl) {
      URL.revokeObjectURL(this.localObjectUrl);
      this.localObjectUrl = null;
    }
  }

  private pickErr(e: any): string | null {
    return e?.error?.message ?? e?.error?.error ?? null;
  }

  private toPublicUrl(path: string) {
    const base = 'http://localhost:8080'; 
    return path.startsWith('http') ? path : `${base}${path}`;
  }
}
