import { Component, inject, signal } from '@angular/core';
import { AdminProductFormComponent } from '../product-form/product-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { ProductResponse } from '../../../../core/models/product';
import { CatalogApiService } from '../../../../core/services/catalog-api.service';

@Component({
  selector: 'app-admin-product-editor-page.component',
  imports: [AdminProductFormComponent],
  templateUrl: './admin-product-editor-page.component.html',
  styleUrl: './admin-product-editor-page.component.css',
})
export class AdminProductEditorPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogApiService);

  productId = signal<number | null>(null);
  product = signal<ProductResponse | null>(null);
  loading = signal(false);

  isEditMode() {
    return this.productId() != null;
  }

  ngOnInit() {
    // /admin/products/new  -> idParam = null
    // /admin/products/:id/edit -> idParam = "12"
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;



    this.productId.set(id);

    // EDIT mode -> load detail
    if (id != null) {
      if (idParam && (!Number.isFinite(id) || id <= 0)) {
        // id bậy -> đá về list hoặc page lỗi
        this.router.navigateByUrl('/admin/products');
        return;
      }
      this.loading.set(true);
      this.catalogService.getProductById(id).subscribe({
        next: (p) => {
          this.product.set(p);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          // không tìm thấy -> đá về list
          this.router.navigateByUrl('/admin/products');
        },
      });
    } else {
      // CREATE mode -> không cần product detail
      this.product.set(null);
    }
  }
}
