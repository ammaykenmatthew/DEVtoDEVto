import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { LoginComponent } from "./login/login.component";
import { MainComponent } from "./main/main.component";


const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        //canActivate:[AuthGuard]
    },
    {
      path: 'main',
      component: MainComponent,
      children: [{ path: '', loadChildren: ()=> import('./main/main.module').then((m)=>m.MainModule)}]
      ,canActivate:[AuthGuard]
    },
    {
      path: 'admin',
      component: AdminComponent,
      children: [{ path: '', loadChildren: ()=> import('./admin/admin.module').then((m)=>m.AdminModule)}]
      ,canActivate:[AdminGuard ]
    },
    {
        path: '', redirectTo: 'login', pathMatch:'full'
    }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
