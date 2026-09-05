# 📸 Fotaza2

Fotaza2 es una red social de fotografía desarrollada como proyecto final, enfocada en la interacción social, la valoración de contenido visual y la gestión de perfiles de usuario.

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza una arquitectura moderna basada en la nube:

* **Backend:** Node.js con Express.
* **Motor de plantillas:** Pug.
* **ORM:** Sequelize (gestionando PostgreSQL en Neon).
* **Base de Datos:** PostgreSQL (Neon Serverless).
* **Almacenamiento de imágenes:** Cloudinary.
* **Autenticación:** Express-Session con Bcrypt para hashing de contraseñas.

## 🛠️ Estructura del Proyecto

```plaintext
├── controllers/    # Lógica de negocio
├── middlewares/    # Interceptores (Multer, Cloudinary, Auth)
├── models/         # Definición de tablas y relaciones
├── public/         # Estilos CSS
├── routes/         # Definición de endpoints
├── seeders/        # Datos de inicialización
├── scripts/        # Scripts de automatización
└── views/          # Plantillas Pug
```

## 📋 Requisitos de Configuración

Para ejecutar el proyecto, crea un archivo `.env` en la raíz con las siguientes variables:
Utiliza como base el archivo .env.example proporcionado:

```
.env.example

```
Completa los valores con tus credenciales de Neon, Cloudinary y tu clave secreta.
## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <https://github.com/Evelyncetera/Fotaza2-CeteraEvelyn>
cd Fotaza2-CeteraEvelyn
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Inicializar la Base de Datos

Para crear las tablas y poblar los datos de prueba automáticamente, ejecuta:

```bash
npm run db:init
```

### 4. Iniciar el servidor

```bash
npm start
```

## 👤 Usuarios de Prueba

Tras ejecutar `npm run db:init`, puedes acceder al sistema con los siguientes usuarios cargados en el seeder:

| Usuario   | Email                                              | Contraseña |
| --------- | -------------------------------------------------- | ---------- |
| UsuarioA  | [usuarioA@fotaza.com](mailto:usuarioA@fotaza.com)  |   123456   |
| UsuarioB  | [usuarioB@fotaza.com](mailto:usuarioB@fotaza.com)  |   123456   |
| UsuarioC  | [usuarioB@fotaza.com](mailto:usuarioB@fotaza.com)  |   123456   |
| UsuarioD  | [usuarioB@fotaza.com](mailto:usuarioB@fotaza.com)  |   123456   |
| --------  | -------------------------------------------------- | ---------- |
| Validador | [validador@fotaza.com](mailto:validador@fotaza.com)|   123456   |


## 📝 Notas de Implementación

* El proyecto está optimizado para trabajar con imágenes en la nube, evitando el almacenamiento local y optimizando el rendimiento mediante Cloudinary.
* La gestión de base de datos se realiza sobre Neon PostgreSQL, permitiendo un entorno serverless escalable.
