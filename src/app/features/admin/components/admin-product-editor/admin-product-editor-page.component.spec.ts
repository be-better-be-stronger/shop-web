import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductEditorPageComponent } from './admin-product-editor-page.component';

describe('AdminProductEditorPageComponent', () => {
  let component: AdminProductEditorPageComponent;
  let fixture: ComponentFixture<AdminProductEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductEditorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductEditorPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
