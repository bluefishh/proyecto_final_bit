import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComercioLocalService {
    constructor(private http: HttpClient) { }

    getComerciosPorComunidad(comunidadId: string): Observable<any[]> {
        return this.http.get<any[]>(`/comercios?comunidadId=${comunidadId}`);
    }

    crearComercio(comercio: any): Observable<any> {
        return this.http.post<any>('/comercios', comercio);
    }

    editarComercio(comercio: any): Observable<any> {
        return this.http.put<any>(`/comercios/${comercio._id}`, comercio);
    }

    eliminarComercio(comercioId: string): Observable<any> {
        return this.http.delete<any>(`/comercios/${comercioId}`);
    }
}
