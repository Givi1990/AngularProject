import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewProductComponent } from './upload-new-product.component';

describe('UploadNewProductComponent', () => {
  let component: UploadNewProductComponent;
  let fixture: ComponentFixture<UploadNewProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadNewProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadNewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
