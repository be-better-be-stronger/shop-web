import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductListPageComponent } from './admin-product-list-page.component';

describe('AdminProductListPageComponent', () => {
  let component: AdminProductListPageComponent;
  let fixture: ComponentFixture<AdminProductListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductListPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
