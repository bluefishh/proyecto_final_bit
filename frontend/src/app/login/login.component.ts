import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
})

export class LoginComponent {
	loginForm: FormGroup;
	showPassword = false;
	error: string | null = null;

	constructor(
		private fb: FormBuilder,
		private titleService: Title,
		private authService: AuthService
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			contrasena: ['', Validators.required],
		});
		this.titleService.setTitle('Iniciar sesión - Community Alert System');
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}

	onSubmit() {
	if (this.loginForm.valid) {
			this.error = null;
			const email = this.loginForm.value.email;
			const contrasena = this.loginForm.value.contrasena;
			this.authService.login(email, contrasena).subscribe({
				next: (response) => {
					// Si el backend envía un token, se guarda en localStorage
					if (response.token) {
						localStorage.setItem('token', response.token);
						console.log('Login exitoso');
					}

					// TODO: Redirigir al usuario al menú principal o dashboard cuando esté implementado
				},
				error: (err) => {
					this.error = err.error?.message || 'Credenciales incorrectas.';
				}
			});
		} else {
			this.error = 'Por favor, complete todos los campos correctamente.';
		}
	}
}
