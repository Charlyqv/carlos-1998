Guía de Instalación y Ejecución
El proyecto está estructurado en un monorepositorio con dos carpetas principales: frontend y backend. Ambas deben ejecutarse en terminales separadas para que la aplicación funcione en su totalidad.
1.Prerrequisitos: Entorno necesario para ejecutar el proyecto.
Asegúrate de tener instalado el siguiente software en tu equipo:
Node.js
Git
2.Clonar el Repositorio:
3.Ejecutar el Backend (SnailPay API): Servidor de Node.js / Express.
Desde la carpeta raíz del proyecto, abre una terminal y ejecuta:
cd backend
Instalar todas las dependencias
npm install
Levantar el servidor en modo desarrollo
npm run dev
4.Ejecutar el Frontend (Dashboard de Usuario): Aplicación React con Vite.
Abre una nueva terminal, asegúrate de estar en la raíz del proyecto y ejecuta:
cd frontend
Instalar todas las dependencias 
npm install
Levantar la aplicación web
npm run dev
5.Ejecución de Pruebas Automatizadas (Testing):Comandos para validar la integridad del código.
Si deseas validar que las reglas de negocio y los contratos de seguridad funcionan correctamente, puedes ejecutar los test suites de la siguiente manera:
Para el Frontend:
En la terminal de la carpeta frontend, ejecuta:
npm run test
Para el Backend:
En la terminal de la carpeta backend, ejecuta:
npm run test
