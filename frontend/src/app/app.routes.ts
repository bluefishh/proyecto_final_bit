import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'comunidades', component: ComunidadesComponent },
];
