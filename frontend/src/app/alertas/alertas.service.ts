import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertasService {
    constructor(private http: HttpClient) { }

    getAlertasPorComunidad(comunidadId: string): Observable<any[]> {
        return this.http.get<any[]>(`/alertas?comunidadId=${comunidadId}`);
    }

    crearAlerta(alerta: any): Observable<any> {
        return this.http.post<any>('/alertas', alerta);
    }

    editarAlerta(alerta: any): Observable<any> {
        return this.http.put<any>(`/alertas/${alerta._id}`, alerta);
    }

    eliminarAlerta(alertaId: string): Observable<any> {
        return this.http.delete<any>(`/alertas/${alertaId}`);
    }
}
