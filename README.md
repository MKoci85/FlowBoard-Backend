# 📚 Flowboard Backend

Bienvenido al repositorio del backend de **Flowboard**, una aplicación web que permite a los usuarios gestionar proyectos y tareas de manera colaborativa, similar a Trello. Este backend maneja toda la lógica de negocio y la persistencia de datos.

## 🚀 Funcionalidades Principales

- **Gestión de usuarios**: Registro, inicio de sesión y restablecimiento de contraseñas.
- **Autenticación y autorización**: Validación de usuarios mediante JWT (JSON Web Tokens) para asegurar la protección de los recursos.
- **Gestión de proyectos y tareas**: CRUD de proyectos y tareas, asignación de miembros, control de permisos (solo los managers pueden eliminar).
- **Historial de actividades**: Registro de cambios en el estado de las tareas y notas agregadas.
- **Envío de correos electrónicos**: Restablecimiento de contraseñas mediante el envío de enlaces a través de **Nodemailer**.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework minimalista para Node.js.
- **TypeScript**: Para un desarrollo más robusto y tipado.
- **Mongoose**: ODM para la interacción con bases de datos MongoDB.
- **bcrypt**: Para el hash seguro de contraseñas.
- **express-validator**: Para la validación de datos de entrada.
- **Nodemailer**: Para el envío de correos electrónicos.

## 🔑 Autenticación y Seguridad

- **JWT (JSON Web Tokens)**: Utilizado para la autenticación segura de las rutas.
- **bcrypt**: Para hashear y verificar contraseñas de usuarios.
- **express-validator**: Asegura que los datos de entrada cumplan con las reglas definidas, mejorando la seguridad y la robustez de la API.

## ✉️ Restablecimiento de Contraseña

El proceso de restablecimiento de contraseña se realiza mediante **Nodemailer**, que envía un enlace seguro al correo electrónico del usuario. Este enlace permite cambiar la contraseña de manera fácil y segura.

## 🌐 Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/flowboard-backend.git
   cd flowboard-backend

2. Instala las dependencias:
   ```bash
   npm install

3. Configura las variables de entorno creando un archivo .env en la raíz del proyecto con las siguientes claves:
    ```env
    DATABASE_URL=tu_mongodb_uri
    PORT=4000
    FRONTEND_URL=URL_FRONTEND
    SMTP_HOST=tu_smtp
    SMTP_PORT=smtp_port
    SMTP_USER=tu_user
    SMTP_PASSWORD=tu_password
    JWT_SECRET=tu_secreto_jwt

4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev


## 📋 Rutas Principales de la API

Las rutas de la API están organizadas en los siguientes archivos:

### 1. `/src/routes/authRoutes.ts`
Contiene las rutas relacionadas con la autenticación de usuarios y la gestión de cuentas:
- **POST /api/auth/register**: Registro de nuevos usuarios.
- **POST /api/auth/login**: Inicio de sesión de usuario.
- **POST /api/auth/reset-password**: Solicitud de restablecimiento de contraseña y envío de correo con enlace de restablecimiento.
- **POST /api/auth/update-password**: Actualización de la contraseña después de la verificación del token de restablecimiento.

### 2. `/src/routes/projectRoutes.ts`
Incluye las rutas para la gestión de proyectos y tareas:
- **GET /api/projects**: Obtiene la lista de proyectos del usuario.
- **POST /api/projects**: Crea un nuevo proyecto.
- **GET /api/projects/:id**: Obtiene los detalles de un proyecto específico.
- **PUT /api/projects/:id**: Actualiza un proyecto existente.
- **DELETE /api/projects/:id**: Elimina un proyecto (solo permitido para usuarios con permisos de manager).
- **POST /api/projects/:projectId/tasks**: Crea una tarea dentro de un proyecto.
- **PUT /api/projects/:projectId/tasks/:taskId**: Actualiza el estado de una tarea y registra el historial de cambios.
- **POST /api/projects/:projectId/tasks/:taskId/notes**: Agrega notas a una tarea y almacena quién las añadió o modificó.

## 📝 Contribución

Si quieres contribuir al desarrollo de **Flowboard**, por favor sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`).
3. Realiza los cambios y haz commit (`git commit -m 'Añadida nueva función'`).
4. Haz push a la rama (`git push origin feature/nueva-funcion`).
5. Abre un pull request para revisar tus cambios.

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Revisa el archivo `LICENSE` para más detalles.

## 🤝 Contacto

Para preguntas o sugerencias, no dudes en ponerte en contacto:

- **Correo electrónico**: [mariano@gmail.com](mailto:mariano@gmail.com)
- **LinkedIn**: [/in/mkoci](https://www.linkedin.com/in/mkoci/)

¡Gracias por interesarte en **Flowboard**!
