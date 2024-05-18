import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details.component';
import { AuthGuard } from 'src/app/guard.service';

const routes: Routes = [
  {
    path: "details",
    component: DetailsComponent
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class DetailsModule {}
