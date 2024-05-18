import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadNewProductComponent } from './upload-new-product.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/guard.service';

const routes: Routes = [
  {
    path: "upload",
    component: UploadNewProductComponent, 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    UploadNewProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class UploadNewProductModule {}
