import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authFunctionGuard } from './auth-function.guard';

import { LoginComponent } from './login/login.component';
import { UserTableComponent } from './user-table/user-table.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "users",
    component: UserTableComponent,
    canActivate: [() => authFunctionGuard({ expectedPermission: 'can_read_users' })],
  },
  {
    path: "create-user",
    component: CreateUserComponent,
    canActivate: [() => authFunctionGuard({ expectedPermission: 'can_create_users' })],
  },
  {
    path: "update/:userId",
    component: UpdateUserComponent,
    canActivate: [() => authFunctionGuard({ expectedPermission: 'can_update_users' })],
  },
  {
    path: "search",
    component: SearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
