import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ManejoResiduosService } from './manejo-residuos.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-manejo-residuos',
	templateUrl: './manejo-residuos.component.html',
	styleUrls: ['./manejo-residuos.component.css'],
	standalone: true,
	imports: [CommonModule, NavbarComponent]
})
export class ManejoResiduosComponent implements OnInit {
	async editarCampannia(campannia: any) {
			const { value: formValues } = await Swal.fire({
				title: 'Editar campaña',
				html:
					`<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${campannia.nombre}">` +
					`<input id="swal-fecha" type="date" class="swal2-input" value="${campannia.fechaCampannia || campannia.fecha_campannia || ''}">` +
					`<input id="swal-hora" type="time" class="swal2-input" value="${campannia.horaCampannia || campannia.hora || ''}">` +
					`<input id="swal-lugar" class="swal2-input" placeholder="Lugar" value="${campannia.ubicacion || campannia.lugar || ''}">` +
					`<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${campannia.descripcion}</textarea>`,
				focusConfirm: false,
				showCancelButton: true,
				preConfirm: () => {
					return [
						(document.getElementById('swal-nombre') as HTMLInputElement)?.value,
						(document.getElementById('swal-fecha') as HTMLInputElement)?.value,
						(document.getElementById('swal-hora') as HTMLInputElement)?.value,
						(document.getElementById('swal-lugar') as HTMLInputElement)?.value,
						(document.getElementById('swal-descripcion') as HTMLTextAreaElement)?.value
					];
				}
			});
			if (formValues) {
				const [nombre, fechaCampannia, horaCampannia, ubicacion, descripcion] = formValues;
				const fechaFinal = fechaCampannia
					? new Date(fechaCampannia).toISOString()
					: (campannia.fechaCampannia || campannia.fecha_campannia);
				const campanniaEditada = {
					nombre,
					descripcion,
					fechaCampannia: fechaFinal,
					horaCampannia,
					ubicacion,
					comunidad: campannia.comunidad,
					_id: campannia._id
				};
				this.manejoResiduosService.updateCampaign(campanniaEditada).subscribe({
					next: (res) => {
						Swal.fire('Campaña actualizada', 'La campaña se ha editado correctamente.', 'success');
						Object.assign(campannia, campanniaEditada);
					},
					error: () => {
						Swal.fire('Error', 'No se pudo editar la campaña.', 'error');
					}
				});
			}
	}

	eliminarCampannia(campannia: any) {
		Swal.fire({
			title: '¿Eliminar campaña?',
			text: 'Esta acción no se puede deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		}).then(result => {
			if (result.isConfirmed) {
				this.manejoResiduosService.deleteCampaign(campannia._id).subscribe({
					next: () => {
						Swal.fire('Eliminada', 'La campaña ha sido eliminada.', 'success');
						this.campaigns = this.campaigns.filter(c => c._id !== campannia._id);
					},
					error: () => {
						Swal.fire('Error', 'No se pudo eliminar la campaña.', 'error');
					}
				});
			}
		});
	}

	async editarPunto(point: any) {
		const { value: formValues } = await Swal.fire({
			title: 'Editar punto de reciclaje',
			html:
				`<input id="swal-nombre-punto" class="swal2-input" placeholder="Nombre" value="${point.nombre}">` +
				`<input id="swal-direccion-punto" class="swal2-input" placeholder="Dirección" value="${point.direccion}">`,
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return [
					(document.getElementById('swal-nombre-punto') as HTMLInputElement)?.value,
					(document.getElementById('swal-direccion-punto') as HTMLInputElement)?.value
				];
			}
		});
		if (formValues) {
			const [nombre, direccion] = formValues;
			const puntoEditado = {
				...point,
				nombre,
				direccion
			};
			this.manejoResiduosService.updatePoint(puntoEditado).subscribe({
				next: (res) => {
					Swal.fire('Punto actualizado', 'El punto de reciclaje se ha editado correctamente.', 'success');
					Object.assign(point, puntoEditado);
				},
				error: () => {
					Swal.fire('Error', 'No se pudo editar el punto de reciclaje.', 'error');
				}
			});
		}
	}

	eliminarPunto(point: any) {
		Swal.fire({
			title: '¿Eliminar punto de reciclaje?',
			text: 'Esta acción no se puede deshacer.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		}).then(result => {
			if (result.isConfirmed) {
				this.manejoResiduosService.deletePoint(point._id).subscribe({
					next: () => {
						Swal.fire('Eliminado', 'El punto de reciclaje ha sido eliminado.', 'success');
						this.points = this.points.filter(p => p._id !== point._id);
					},
					error: () => {
						Swal.fire('Error', 'No se pudo eliminar el punto de reciclaje.', 'error');
					}
				});
			}
		});
	}
	async editarHorarios() {
		const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
		let html = '';
		dias.forEach(dia => {
			html += `<label>${dia.charAt(0).toUpperCase() + dia.slice(1)}:</label>`;
			html += `<input id="swal-${dia}-inicio" type="time" class="swal2-input" value="${this.schedule[dia]?.split(' - ')[0] || ''}">`;
			html += `<input id="swal-${dia}-fin" type="time" class="swal2-input" value="${this.schedule[dia]?.split(' - ')[1] || ''}">`;
		});
		const { value: formValues } = await Swal.fire({
			title: 'Editar horarios de recolección',
			html,
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return dias.map(dia => [
					(document.getElementById(`swal-${dia}-inicio`) as HTMLInputElement)?.value,
					(document.getElementById(`swal-${dia}-fin`) as HTMLInputElement)?.value
				]);
			}
		});
		if (formValues) {
			const horarios = dias.map((dia, i) => ({
				dia,
				horaInicio: formValues[i][0],
				horaFin: formValues[i][1],
				comunidad: this.comunidadId
			}));
			this.manejoResiduosService.updateSchedule(horarios).subscribe({
				next: () => {
					Swal.fire('Horarios actualizados', 'Los horarios se han guardado correctamente.', 'success');
					dias.forEach((dia, i) => {
						this.schedule[dia] = `${formValues[i][0]} - ${formValues[i][1]}`;
					});
				},
				error: () => {
					Swal.fire('Error', 'No se pudo actualizar los horarios.', 'error');
				}
			});
		}
	}
	esAdmin: boolean = false;

	async crearPuntoReciclaje() {
		const { value: formValues } = await Swal.fire({
			title: 'Crear punto de reciclaje',
			html:
				'<input id="swal-nombre-punto" class="swal2-input" placeholder="Nombre">' +
				'<input id="swal-direccion-punto" class="swal2-input" placeholder="Dirección">',
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return [
					(document.getElementById('swal-nombre-punto') as HTMLInputElement)?.value,
					(document.getElementById('swal-direccion-punto') as HTMLInputElement)?.value
				];
			}
		});
		if (formValues) {
			const [nombre, direccion] = formValues;
			const punto = {
				nombre,
				direccion,
				tipo: 'todos',
				comunidad: this.comunidadId
			};
			this.manejoResiduosService.createPoint(punto).subscribe({
				next: (res) => {
					Swal.fire('Punto creado', 'El punto de reciclaje se ha guardado correctamente.', 'success');
					this.points.push(res);
				},
				error: () => {
					Swal.fire('Error', 'No se pudo guardar el punto de reciclaje.', 'error');
				}
			});
		}
	}
	async crearCampannia() {
		const { value: formValues } = await Swal.fire({
			title: 'Crear nueva campaña',
			html:
				'<input id="swal-nombre" class="swal2-input" placeholder="Nombre">' +
				'<input id="swal-fecha" type="date" class="swal2-input" placeholder="Fecha">' +
				'<input id="swal-hora" type="time" class="swal2-input" placeholder="Hora">' +
				'<input id="swal-lugar" class="swal2-input" placeholder="Lugar">' +
				'<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>',
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				return [
					(document.getElementById('swal-nombre') as HTMLInputElement)?.value,
					(document.getElementById('swal-fecha') as HTMLInputElement)?.value,
					(document.getElementById('swal-hora') as HTMLInputElement)?.value,
					(document.getElementById('swal-lugar') as HTMLInputElement)?.value,
					(document.getElementById('swal-descripcion') as HTMLTextAreaElement)?.value
				];
			}
		});
		if (formValues) {
			const [nombre, fechaCampannia, horaCampannia, ubicacion, descripcion] = formValues;
			const campannia = {
				nombre,
				descripcion,
				fechaCampannia: fechaCampannia ? new Date(fechaCampannia).toISOString() : null,
				horaCampannia,
				ubicacion,
				comunidad: this.comunidadId
			};
			this.manejoResiduosService.createCampaign(campannia).subscribe({
				next: (res) => {
					Swal.fire('Campaña creada', 'La campaña se ha creado correctamente.', 'success');
					this.campaigns.push(res);
				},
				error: () => {
					Swal.fire('Error', 'No se pudo guardar la campaña.', 'error');
				}
			});
		}
	}
	comunidadId: string = '';
	schedule: any = {
		lunes: '', martes: '', miércoles: '', jueves: '', viernes: '', sábado: '', domingo: ''
	};
	campaigns: any[] = [];
	points: any[] = [];

	constructor(private manejoResiduosService: ManejoResiduosService) { }

	ngOnInit() {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const payload = JSON.parse(atob(token.split('.')[1]));
				this.esAdmin = payload.rol === 'admin';
			} catch (e) {
				this.esAdmin = false;
			}
		}
		const comunidadStr = localStorage.getItem('comunidadSeleccionada');
		if (comunidadStr) {
			const comunidad = JSON.parse(comunidadStr);
			this.comunidadId = comunidad._id;
		}
		this.manejoResiduosService.getSchedule(this.comunidadId).subscribe((data: any[]) => {
			type DiasSemana = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';
			const dias: Record<DiasSemana, string> = {
				lunes: '', martes: '', miércoles: '', jueves: '', viernes: '', sábado: '', domingo: ''
			};
			data.forEach(h => {
				const dia = h.dia as DiasSemana;
				if (dia in dias) {
					dias[dia] = h.horaInicio + ' - ' + h.horaFin;
				}
			});
			this.schedule = dias;
		});
		this.manejoResiduosService.getCampaigns().subscribe((data: any[]) => {
			this.campaigns = data;
		});
		this.manejoResiduosService.getPoints().subscribe((data: any[]) => {
			this.points = data;
		});
	}
}
