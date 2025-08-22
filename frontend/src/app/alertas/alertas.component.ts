import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AlertasService } from './alertas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-alertas',
    templateUrl: './alertas.component.html',
    styleUrls: ['./alertas.component.css'],
    standalone: true,
    imports: [CommonModule, NgIf, NgFor, DatePipe, NavbarComponent]
})
export class AlertasComponent implements OnInit {
    comunidad: any = null;
    alerts: any[] = [];
    tipoActivo: 'todas' | 'seguridad' | 'emergencia' | 'comunidad' = 'todas';

    constructor(private alertasService: AlertasService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        const comunidadStr = localStorage.getItem('comunidadSeleccionada');
        if (comunidadStr) {
            this.comunidad = JSON.parse(comunidadStr);
            this.cargarAlertas();
        }
    }

    cargarAlertas() {
    if (!this.comunidad) return;
    this.alertasService.getAlertasPorComunidad(this.comunidad._id).subscribe({
            next: (data: any) => {
                this.alerts = data || [];
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Error al cargar alertas',
                    showConfirmButton: true
                });
                this.alerts = [];
                this.cdr.detectChanges();
            }
        });
    }

    cambiarTab(tipo: 'todas' | 'seguridad' | 'emergencia' | 'comunidad') {
        this.tipoActivo = tipo;
    }

    crearAlerta() {
        Swal.fire({
            title: 'Crear nueva alerta',
            html:
                '<input id="titulo" class="swal2-input" placeholder="Título">' +
                '<textarea id="descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const titulo = (document.getElementById('titulo') as HTMLInputElement)?.value;
                const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement)?.value;
                if (!titulo || !descripcion) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { titulo, descripcion };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const token = localStorage.getItem('token');
                let publicadoPor = '';
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        publicadoPor = payload.id;
                    } catch (e) {}
                }
                const nuevaAlerta = {
                    titulo: result.value.titulo,
                    descripcion: result.value.descripcion,
                    comunidad: this.comunidad?._id,
                    publicadoPor
                };
                this.alertasService.crearAlerta(nuevaAlerta).subscribe({
                    next: () => {
                        Swal.fire('¡Alerta creada!', '', 'success');
                        this.cargarAlertas();
                    },
                    error: (err: any) => {
                        Swal.fire('Error al crear alerta', err.message || '', 'error');
                    }
                });
            }
        });
    }
}
