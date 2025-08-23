# Ejecución

Para ejecutar el proyecto, seguir estos pasos:

1. Clonar el repositorio en la máquina local:
   ```bash
   git clone <https://github.com/bluefishh/proyecto_final_bit.git>
   cd proyecto_final
   ```

2. Instalar las dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Configurar las variables de entorno:
   - Crear un archivo `.env` en la carpeta `backend` y definir las variables necesarias (por ejemplo, `MONGODB_URI`, `JWT_SECRET`, etc.).

4. Iniciar el servidor del backend:
   ```bash
   npm start
   ```

5. Abrir otro terminal y navegar a la carpeta del frontend:
   ```bash
   cd frontend
   ```

6. Instalar las dependencias del frontend:
   ```bash
   npm install
   ```

7. Iniciar la aplicación del frontend:
   ```bash
   ng serve
   ```

8. Abrir tu navegador y acceder a `http://localhost:4200` para ver la aplicación en acción.