import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManejoResiduosService {
	updateCampaign(campaign: any): Observable<any> {
		return this.http.put<any>(`/campannias/${campaign._id}`, campaign);
	}

	deleteCampaign(id: string): Observable<any> {
		return this.http.delete<any>(`/campannias/${id}`);
	}

	updatePoint(point: any): Observable<any> {
		return this.http.put<any>(`/puntos/${point._id}`, point);
	}

	deletePoint(id: string): Observable<any> {
		return this.http.delete<any>(`/puntos/${id}`);
	}
	updateSchedule(horarios: any[]): Observable<any> {
		return this.http.put<any>('/horarios/', horarios);
	}
	constructor(private http: HttpClient) { }

	getSchedule(comunidadId: string): Observable<any[]> {
		return this.http.get<any[]>(`/horarios?comunidad=${comunidadId}`);
	}

	getCampaigns(): Observable<any[]> {
		return this.http.get<any[]>('/campannias');
	}

	getPoints(): Observable<any[]> {
		return this.http.get<any[]>('/puntos');
	}

	createPoint(point: any): Observable<any> {
		return this.http.post<any>('/puntos', point);
	}

	createCampaign(campaign: any): Observable<any> {
		return this.http.post<any>('/campannias', campaign);
	}
}