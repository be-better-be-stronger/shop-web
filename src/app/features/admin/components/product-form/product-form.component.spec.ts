import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let component: AdminProductFormComponent;
  let fixture: ComponentFixture<AdminProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
