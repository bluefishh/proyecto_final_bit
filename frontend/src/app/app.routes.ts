import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { AuthGuard } from './auth/auth.guard';
import { AlertasComponent } from './alertas/alertas.component';
import { ManejoResiduosComponent } from './manejo-residuos/manejo-residuos.component';
import { ComercioLocalComponent } from './comercio-local/comercio-local.component';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'comunidades', component: ComunidadesComponent },
	{ path: 'alertas', component: AlertasComponent },
	{ path: 'manejoresiduos', component: ManejoResiduosComponent },
	{ path: 'comerciolocal', component: ComercioLocalComponent },
];
