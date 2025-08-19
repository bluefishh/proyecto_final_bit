import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
	registerForm: FormGroup;
	showPassword = false;
	showConfirmPassword = false;
	error: string | null = null;

	constructor(
		private fb: FormBuilder,
		private titleService: Title,
		private authService: AuthService,
		private router: Router
	) {
		this.registerForm = this.fb.group({
			primerNombre: ['', Validators.required],
			segundoNombre: [''],
			primerApellido: ['', Validators.required],
			segundoApellido: [''],
			email: ['', [Validators.required, Validators.email]],
			contrasena: ['', Validators.required],
			confirmarContrasena: ['', Validators.required],
			fechaNacimiento: ['', Validators.required],
			genero: ['', Validators.required],
		});
		this.titleService.setTitle('Crear cuenta - Community Alert System');
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
	}

	toggleConfirmPasswordVisibility() {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	onSubmit() {
		const form = this.registerForm.value;
		// Validaciones de campos obligatorios
		if (!form.primerNombre || !form.primerApellido || !form.email || !form.contrasena || !form.confirmarContrasena || !form.fechaNacimiento || !form.genero) {
			this.error = 'Por favor, complete todos los campos obligatorios.';
			return;
		}

		// Validación coincidencia de contraseñas
		if (form.contrasena !== form.confirmarContrasena) {
			this.error = 'Las contraseñas no coinciden.';
			return;
		}

		// Validación formato de fecha
		if (isNaN(Date.parse(form.fechaNacimiento))) {
			this.error = 'La fecha de nacimiento no es válida.';
			return;
		}

		// Validación género
		if (!['masculino', 'femenino', 'otro'].includes(form.genero)) {
			this.error = 'Seleccione un género válido.';
			return;
		}

		if (this.registerForm.valid) {
			this.authService.register(form).subscribe({
				next: () => {
					Swal.fire({
						icon: 'success',
						title: '¡Registro exitoso!',
						text: 'Su cuenta ha sido creada correctamente.',
						confirmButtonText: 'Ir al inicio de sesión'
					}).then(() => {
						this.router.navigate(['/login']);
					});
				},
				error: err => {
					if (err.error?.error) {
						this.error = err.error.error;
					} else if (err.error?.message) {
						this.error = err.error.message;
					} else if (err.message) {
						this.error = err.message;
					} else {
						this.error = 'Error al crear la cuenta.';
					}
				}
			});
		} else {
			this.error = 'Por favor, complete todos los campos correctamente.';
		}
	}
}
