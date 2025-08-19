import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
// Servicio de autenticación, maneja el login y registro de usuarios
export class AuthService {
    private apiUrl = 'http://localhost:3000/usuarios/login';
    private registerUrl = 'http://localhost:3000/usuarios/register';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, contrasena: password });
    }

    register(data: any): Observable<any> {
        return this.http.post<any>(this.registerUrl, data);
    }
}