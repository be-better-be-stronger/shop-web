import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ ADD
import { AdminProductService } from '../../services/admin-product.service';
import {
  PageProductRequest,
  ProductResponse,
  ProductStatusFilter,
} from '../../../../core/models/product';

@Component({
  selector: 'app-admin-product-list-page',
  standalone: true,
  imports: [FormsModule], // ✅ ADD
  templateUrl: './admin-product-list-page.component.html',
  styleUrl: './admin-product-list-page.component.css',
})
export class AdminProductListPageComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(AdminProductService);

  items = signal<ProductResponse[]>([]);
  loading = signal(false);
  err = signal<string | null>(null);

  keyword = signal('');
  catId = signal<number | null>(null);
  statusFilter = signal<ProductStatusFilter>('all');

  sortBy = signal<PageProductRequest['sort']>(undefined);
  sortDir = signal<NonNullable<PageProductRequest['dir']>>('desc');

  page = signal(1);
  pageSize = signal(10);

  totalPages = signal(0);
  totalElements = signal(0);

  busyId = signal<number | null>(null);

  // ✅ ADD: model cho input
  kwModel = '';

  ngOnInit() {
    // ✅ sync lần đầu để input hiển thị đúng
    this.kwModel = this.keyword();
    this.reload();
  }

  onKeyword(v: string) {
    this.keyword.set(v);
  }

  // ✅ ADD: chỉ reload khi bấm Search
  applyKeyword() {
    this.onKeyword(this.kwModel);
    this.page.set(1);
    this.reload();
  }

  // ✅ ADD: clear + reload
  clearKeyword() {
    this.kwModel = '';
    this.onKeyword('');
    this.page.set(1);
    this.reload();
  }

  goCreate() {
    this.router.navigateByUrl('/admin/products/new');
  }

  goEdit(id: number) {
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  onChangeStatus(s: ProductStatusFilter) {
    this.statusFilter.set(s);
    this.page.set(1);
    this.reload();
  }

  onChangeCategory(cat: number | null) {
    this.catId.set(cat);
    this.page.set(1);
    this.reload();
  }

  onChangeSort(field: NonNullable<PageProductRequest['sort']>) {
    if (this.sortBy() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDir.set('asc');
    }
    this.page.set(1);
    this.reload();
  }

  // ✅ helper parse cat
  parseCat(v: string): number | null {
    const s = (v ?? '').trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  reload() {
    this.err.set(null);
    this.loading.set(true);

    const req: PageProductRequest = {
      page: this.page() - 1,
      size: this.pageSize(),
      q: this.keyword().trim() || undefined,
      cat: this.catId() ?? undefined,
      sort: this.sortBy() ?? undefined,
      dir: this.sortDir() ?? undefined,
    };

    const status = this.statusFilter();

    this.productService.list(req, status).subscribe({
      next: (res) => {
        this.items.set(res.content);
        this.totalPages.set(res.totalPages ?? 0);
        this.totalElements.set(res.totalElements ?? 0);
        this.loading.set(false);

        if (res.totalPages > 0 && this.page() > res.totalPages) {
          this.page.set(res.totalPages);
          this.reload();
        }
      },
      error: (e) => {
        this.loading.set(false);
        this.err.set(e?.error?.message ?? e?.error?.error ?? 'Load failed');
      },
    });
  }

  prev() {
    if (this.page() <= 1) return;
    this.page.set(this.page() - 1);
    this.reload();
  }

  next() {
    const tp = this.totalPages();
    if (tp > 0 && this.page() >= tp) return;
    this.page.set(this.page() + 1);
    this.reload();
  }

  toggleActive(p: ProductResponse) {
    const id = (p as any).id as number;
    const isActive = !!(p as any).isActive;

    this.busyId.set(id);
    this.err.set(null);

    const obs = isActive
      ? this.productService.disable(id)
      : this.productService.enable(id);

    obs.subscribe({
      next: () => {
        this.busyId.set(null);
        this.items.update((arr) =>
          arr.map((x: any) => (x.id === id ? { ...x, isActive: !isActive } : x))
        );
      },
      error: (e) => {
        this.busyId.set(null);
        this.err.set(e?.error?.message ?? e?.error?.error ?? 'Update status failed');
      },
    });
  }
}
