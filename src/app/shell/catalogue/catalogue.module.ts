import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogueComponent } from './catalogue.component';

const routes: Routes = [
  {
    path: "catalogue",
    component: CatalogueComponent
  }
];

@NgModule({
  declarations: [
    CatalogueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class CatalogueModule {}
