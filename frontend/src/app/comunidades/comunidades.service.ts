import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComunidadesService {
    constructor(private http: HttpClient) { }

    getMisComunidades(): Observable<any[]> {
        const token = localStorage.getItem('token');
        let usuarioId = '';
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                usuarioId = payload.id;
            } catch (e) {}
        }
        return this.http.get<any[]>(`/comunidades/mis/${usuarioId}`);
    }

    buscarComunidadesNominatim(query: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/nominatim/search?q=${encodeURIComponent(query)}`);
    }

    unirseComunidad(comunidad: any): Observable<any> {
        return this.http.post('/comunidades/unirse', comunidad);
    }
}
