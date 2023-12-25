import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserTableComponent } from './user-table/user-table.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SearchComponent } from './search/search.component';
import { CreateVacuumComponent } from './create-vacuum/create-vacuum.component';
import { ErrorHistoryComponent } from './error-history/error-history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserTableComponent,
    CreateUserComponent,
    UpdateUserComponent,
    SearchComponent,
    CreateVacuumComponent,
    ErrorHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
