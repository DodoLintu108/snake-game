  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { HomeComponent } from './pages/home/home.component';
  import { LoginComponent } from './pages/login/login.component';
  import { SignupComponent } from './pages/signup/signup.component';
  import { ProfileComponent } from './pages/profile/profile.component';
  import { GameComponent } from './pages/game/game.component';
  import { PaymentComponent } from './pages/payment/payment.component';

  const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'game', component: GameComponent },
    { path: 'payment', component: PaymentComponent },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)], 
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
