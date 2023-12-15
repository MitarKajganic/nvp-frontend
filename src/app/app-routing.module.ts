import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserTableComponent } from './user-table/user-table.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "table",
    component: UserTableComponent
  },
  {
    path: "create",
    component: CreateUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
