import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { GameComponent } from './pages/game/game.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { GameWrapperComponent } from './components/game-wrapper/game-wrapper.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,  
  },
  { 
    path: 'login', 
    component: LoginComponent,
  },
  { 
    path: 'signup', 
    component: SignupComponent,
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [() => {
      const token = localStorage.getItem('token');
      return !!token; // Redirect to login if no token
    }]
  },
  { 
    path: 'game', 
    component: GameComponent,
    canActivate: [() => {
      const token = localStorage.getItem('token');
      const hasPaid = localStorage.getItem('paymentStatus') === 'true';
      return !!token && hasPaid; // Redirect if not logged in or hasn't paid
    }]
  },
  { 
    path: 'payment', 
    component: PaymentComponent,
    canActivate: [() => {
      const token = localStorage.getItem('token');
      return !!token; // Redirect to login if no token
    }]
  },
  { path: '', component: GameWrapperComponent },
  // Catch any other routes and redirect to home
  { 
    path: '**', 
    redirectTo: '' 
  }
];