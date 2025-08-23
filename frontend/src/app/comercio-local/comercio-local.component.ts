import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, NgIf, NgFor } from '@angular/common';
import { ComercioLocalService } from './comercio-local.service';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-comercio-local',
    templateUrl: './comercio-local.component.html',
    styleUrls: ['./comercio-local.component.css'],
    standalone: true,
    imports: [CommonModule, NgIf, NgFor, DatePipe, NavbarComponent]
})
export class ComercioLocalComponent implements OnInit {
    comunidad: any = null;
    comercios: any[] = [];
    isAdmin: boolean = false;

    constructor(private comercioLocalService: ComercioLocalService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        const comunidadStr = localStorage.getItem('comunidadSeleccionada');
        if (comunidadStr) {
            this.comunidad = JSON.parse(comunidadStr);
            this.cargarComercios();
        }
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.isAdmin = payload.rol === 'admin';
            } catch (e) {
                this.isAdmin = false;
            }
        }
    }
    editarComercio(comercio: any) {
        Swal.fire({
            title: 'Editar oferta',
            html:
                `<input id='nombreComercio' class='swal2-input' placeholder='Nombre del negocio' value='${comercio.nombreComercio}'>` +
                `<input id='descuento' class='swal2-input' placeholder='Descuento' value='${comercio.descuento}'>` +
                `<input id='fechaVigencia' type='date' class='swal2-input' value='${comercio.fechaVigencia?.slice(0,10)}'>` +
                `<textarea id='descripcion' class='swal2-textarea' placeholder='Descripción'>${comercio.descripcion}</textarea>` +
                `<input id='direccionComercio' class='swal2-input' placeholder='Dirección' value='${comercio.direccionComercio}'>`,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombreComercio = (document.getElementById('nombreComercio') as HTMLInputElement)?.value;
                const descuento = (document.getElementById('descuento') as HTMLInputElement)?.value;
                const fechaVigencia = (document.getElementById('fechaVigencia') as HTMLInputElement)?.value;
                const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement)?.value;
                const direccionComercio = (document.getElementById('direccionComercio') as HTMLInputElement)?.value;
                if (!nombreComercio || !descuento || !fechaVigencia || !descripcion || !direccionComercio) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombreComercio, descuento, fechaVigencia, descripcion, direccionComercio };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const actualizado = {
                    ...comercio,
                    nombreComercio: result.value.nombreComercio,
                    descuento: result.value.descuento,
                    fechaVigencia: result.value.fechaVigencia,
                    descripcion: result.value.descripcion,
                    direccionComercio: result.value.direccionComercio
                };
                this.comercioLocalService.editarComercio(actualizado).subscribe({
                    next: () => {
                        Swal.fire('¡Oferta actualizada!', '', 'success');
                        this.cargarComercios();
                    },
                    error: (err: any) => {
                        Swal.fire('Error al actualizar oferta', err.message || '', 'error');
                    }
                });
            }
        });
    }

    eliminarComercio(comercio: any) {
        Swal.fire({
            title: '¿Eliminar oferta?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.comercioLocalService.eliminarComercio(comercio._id).subscribe({
                    next: () => {
                        Swal.fire('¡Oferta eliminada!', '', 'success');
                        this.cargarComercios();
                    },
                    error: (err: any) => {
                        Swal.fire('Error al eliminar oferta', err.message || '', 'error');
                    }
                });
            }
        });
    }

    cargarComercios() {
        if (!this.comunidad) return;
        this.comercioLocalService.getComerciosPorComunidad(this.comunidad._id).subscribe({
            next: (data: any) => {
                this.comercios = data || [];
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Error al cargar comercios',
                    showConfirmButton: true
                });
                this.comercios = [];
                this.cdr.detectChanges();
            }
        });
    }

    crearComercio() {
        Swal.fire({
            title: 'Crear nueva oferta',
            html:
                '<input id="nombreComercio" class="swal2-input" placeholder="Nombre del negocio">' +
                '<input id="descuento" class="swal2-input" placeholder="Descuento">' +
                '<input id="fechaVigencia" type="date" class="swal2-input" placeholder="Fecha de vigencia">' +
                '<textarea id="descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>' +
                '<input id="direccionComercio" class="swal2-input" placeholder="Dirección">',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombreComercio = (document.getElementById('nombreComercio') as HTMLInputElement)?.value;
                const descuento = (document.getElementById('descuento') as HTMLInputElement)?.value;
                const fechaVigencia = (document.getElementById('fechaVigencia') as HTMLInputElement)?.value;
                const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement)?.value;
                const direccionComercio = (document.getElementById('direccionComercio') as HTMLInputElement)?.value;
                if (!nombreComercio || !descuento || !fechaVigencia || !descripcion || !direccionComercio) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombreComercio, descuento, fechaVigencia, descripcion, direccionComercio };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const token = localStorage.getItem('token');
                let publicadoPor = '';
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        publicadoPor = payload.id;
                    } catch (e) { }
                }
                const nuevoComercio = {
                    nombreComercio: result.value.nombreComercio,
                    descuento: result.value.descuento,
                    fechaVigencia: result.value.fechaVigencia,
                    descripcion: result.value.descripcion,
                    direccionComercio: result.value.direccionComercio,
                    comunidad: this.comunidad?._id,
                    publicadoPor
                };
                this.comercioLocalService.crearComercio(nuevoComercio).subscribe({
                    next: () => {
                        Swal.fire('¡Oferta creada!', '', 'success');
                        this.cargarComercios();
                    },
                    error: (err: any) => {
                        Swal.fire('Error al crear oferta', err.message || '', 'error');
                    }
                });
            }
        });
    }
}
