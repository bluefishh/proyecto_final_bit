import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [CommonModule, NgClass]
})
export class NavbarComponent {
    navegar(ruta: string, event?: Event) {
        if (event) event.preventDefault();
        this.router.navigate([ruta]);
    }

    dropdownOpen = false;
    nombreUsuario = '';

    constructor(private router: Router) {
        const nombre = localStorage.getItem('nombreUsuario');
        this.nombreUsuario = nombre ? nombre : 'Usuario';
    }

    isActive(path: string): boolean {
        return this.router.url.startsWith(path);
    }

    logout(event?: Event) {
        if (event) event.preventDefault();
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro que deseas salir?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('nombreUsuario');
                localStorage.removeItem('comunidadSeleccionada');
                localStorage.removeItem('usuario');
                this.router.navigate(['/login']);
            }
        });
    }

    seleccionarComunidad(event: Event) {
        event.preventDefault();
        this.router.navigate(['/comunidades']);
    }
}
