import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserTableComponent } from './user-table/user-table.component';

const routes: Routes = [
  {
    path: "",
    component:LoginComponent
  },
  {
    path: "table",
    component:UserTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
