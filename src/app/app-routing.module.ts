import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MainComponent } from './shared/components/main/main.component';
import { AuthGuard } from './shared/guards/auth-guard';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    // auth
    canActivate: [AuthGuard],
    path: '',
    component: MainComponent,
    children:[
      { path: 'dashboard', component: HomeComponent},
      { path: 'settings', component: SettingsComponent},
      { path: 'profile', component: ProfileComponent},
      { path: '**', redirectTo: '/dashboard'}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
