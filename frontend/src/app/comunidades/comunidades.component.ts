import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ComunidadesService } from './comunidades.service';
import Swal from 'sweetalert2';

import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-comunidades',
    templateUrl: './comunidades.component.html',
    styleUrls: ['./comunidades.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, NgIf, NgFor]
})
export class ComunidadesComponent implements OnInit {

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
                this.router.navigate(['/login']);
            }
        });
    }
    nombreUsuario: string = '';
    dropdownOpen: boolean = false;
    tabActivo: 'mis' | 'explorar' = 'mis';
    busqueda: string = '';
    comunidadesFiltradas: any[] = [];
    busquedaRealizada: boolean = false;
    misComunidades: any[] = [];
    comunidadesExplorar: any[] = [];
    debounceTimeout: any;
    lastQuery: string = '';

    constructor(private comunidadesService: ComunidadesService, private cdr: ChangeDetectorRef, private router: Router) { }

    ngOnInit() {
            this.comunidadesService.getMisComunidades().subscribe(data => {
                this.misComunidades = data;
                if (this.tabActivo === 'mis') {
                    this.filtrarComunidades();
                }
            });
            this.comunidadesFiltradas = [];
            this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    }

    filtrarComunidades() {
        const query = this.busqueda.trim().toLowerCase();
        if (this.tabActivo === 'mis') {
            this.comunidadesFiltradas = this.misComunidades.filter(c =>
                (c.nombre || '').toLowerCase().includes(query) ||
                (c.ciudad || '').toLowerCase().includes(query)
            );
        } else {
            if (query.length < 3) {
                this.comunidadesFiltradas = [];
                this.busquedaRealizada = false;
                return;
            }
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.comunidadesService.buscarComunidadesNominatim(query).subscribe({
                    next: (data) => {
                        this.comunidadesFiltradas = data || [];
                        this.busquedaRealizada = true;
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        console.error('Error en búsqueda de barrios:', err);
                        this.comunidadesFiltradas = [];
                        this.busquedaRealizada = true;
                        this.cdr.detectChanges();
                    }
                });
            }, 500);
        }
    }

    ingresarComunidad(comunidad: any) {
        // TODO: Implementar la lógica para ingresar a la comunidad
    }

    unirseComunidad(item: any) {
        let usuarioId = '';
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                usuarioId = payload.id;
            } catch (e) {}
        }
        // Usar los campos que vienen del backend
        const comunidad = {
            apiId: item.id,
            nombre: item.barrio || item.nombre || '',
            ciudad: item.municipio || 'N/A',
            estado: item.departamento || 'N/A',
            codigoPostal: 'N/A',
            usuarioId
        };
        this.comunidadesService.unirseComunidad(comunidad).subscribe({
            next: (data: any) => {
                if (data && data.mensaje && data.mensaje.includes('ya es miembro')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Advertencia',
                        text: data.mensaje || 'Ya eres parte de esta comunidad.',
                        showConfirmButton: true
                    });
                } else if (data && data.mensaje && (data.mensaje.includes('usuario unido') || data.mensaje.includes('creada y usuario unido'))) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Hecho!',
                        text: 'Ahora eres parte de la comunidad.',
                        showConfirmButton: true
                    });
                    this.comunidadesService.getMisComunidades().subscribe(mis => {
                        this.misComunidades = mis;
                        this.filtrarComunidades();
                    });
                }
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Error al unirse a la comunidad',
                    showConfirmButton: true
                });
            }
        });
    }

    cambiarTab(tab: 'mis' | 'explorar') {
        this.tabActivo = tab;
        this.busqueda = '';
        this.comunidadesFiltradas = [];
        this.busquedaRealizada = false;
        this.filtrarComunidades();
    }
}
