import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailsModule } from './details/details.module';
import { FormsModule } from '@angular/forms';
import { CatalogueModule } from './catalogue/catalogue.module';
import { UploadNewProductModule } from './upload-new-product/upload.module';
import { ShellComponent } from './shell.component';
import { LoginModule } from './login/login.module';
import { AuthGuard } from '../guard.service';
import { CartModule } from './cart/cart.module';
import { TranslatePipe } from './translater.shell';

const routes: Routes = [
  {
    path: "shell",
    component: ShellComponent,
    children: [
      {
        path: "", 
        redirectTo: "catalogue",
        pathMatch: "full"
      },
      {
        path: "",
        loadChildren: () => import('./catalogue/catalogue.module')
          .then(module => module.CatalogueModule)
          .catch(error => {
            console.error('Dynamic module loading failed:', error);
            throw error; 
          })
      },
      {
        path: "",
        loadChildren: () => import('./details/details.module')
          .then(module => module.DetailsModule  )
          .catch(error => {
            console.error('Dynamic module loading failed:', error);
            throw error; 
          })
      },
      {
        path: "",
        loadChildren: () => import('./upload-new-product/upload.module')
          .then(module => module.UploadNewProductModule)
          .catch(error => {
            console.error('Dynamic module loading failed:', error);
            throw error; 
          }),
          canActivate: [AuthGuard]
      },
      {
        path: "",
        loadChildren: () => import('./cart/cart.module')
          .then(module => module.CartModule)
          .catch(error => {
            console.error('Dynamic module loading failed:', error);
            throw error; 
          }),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [ShellComponent, TranslatePipe],
  imports: [
    CommonModule,
    DetailsModule,
    FormsModule,
    LoginModule,
    CartModule,
    CatalogueModule,
    UploadNewProductModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  exports: [TranslatePipe]
 
})
export class ShellModule {}
