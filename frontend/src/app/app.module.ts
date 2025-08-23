import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { App } from './app';
import { ComunidadesComponent } from './comunidades/comunidades.component';
import { ManejoResiduosComponent } from './manejo-residuos/manejo-residuos.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
	declarations: [
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(routes),
		ComunidadesComponent,
		ManejoResiduosComponent
	],
	providers: [AuthGuard],
	bootstrap: [App]
})
export class AppModule { }
