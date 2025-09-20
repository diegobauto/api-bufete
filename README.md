# Prueba Técnica – Backend Node.js

API REST para la gestión de abogados y demandas en un bufete.

## 🎯 Objetivo

Desarrollar una API REST para la gestión de abogados y demandas en un bufete. Se evaluará arquitectura, manejo de base de datos, autenticación y buenas prácticas de desarrollo.

## 📋 Requerimientos Técnicos

- Node.js (v18+), Express.js
- PostgreSQL (con Docker Compose)
- Sequelize como ORM
- JWT para autenticación básica
- Validación de datos y manejo centralizado de errores
-  Git para control de versiones

---

## 🛠️ Instalación y Ejecución

A continuación se declaran los pasos para la instalación y ejecución de la API, tener en cuenta cada uno de los comandos:

1. **Clonar el repositorio**

    Clonar el repositorio
    ```bash
    git clone https://github.com/diegobauto/api-bufete.git
    ```

    Ingresar a la carpeta clonada (al proyecto)
    ```bash
    cd api-bufete
    ```

2. **Instalar dependencias**

    ```bash
    npm install
    ```

3. **Configurar variables de entorno**

    Crear archivo .env en la raíz del proyecto, usar de ejemplo:
    ```bash
    NODE_ENV=development
    PORT=3000

    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=db_bufete
    DB_USER=postgres
    DB_PASSWORD=postgres

    # JWT
    JWT_SECRET=key-bufete-abogados
    JWT_EXPIRE=2h
    ```

4. **Ejecutar archivo Docker Compose**

    Es necesario tener instalado Docker en tú maquina
    ```bash
    docker compose up -d
    ```

5. **Ejecutar migraciones y seeders**

    Paso escencial para la creación de tablas y registros de prueba
    ```bash
    npm run db:migrate
    ```

    ```bash
    npm run db:seed
    ```

6. **Iniciar servidor**

    ```bash
    npm run dev
    ```

La API estará disponible en `http://localhost:3000/`

---

## 📖 Documentación API

### Acceso a la documentación

Una vez que el servidor esté ejecutándose, accede a (se coloca en dicha ruta por practicidad):

- **Swagger UI**: `http://localhost:3000/`

---

### Autenticación

La API utiliza JWT Bearer tokens. Primero debes autenticarte:

```bash
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Usuarios por Defecto

| Usuario | Contraseña | Rol      |
| ------- | ---------- | -------- |
| admin   | admin123   | admin    |
| diego   | diego123   | operator |

Usa el token devuelto en el header `Authorization: Bearer <token>` para consumir los demas endpoints

---

## 📌 Endpoints

### Autenticación

- `POST /auth/login` - Iniciar sesión

### Gestión de Abogados

- `POST /lawyers` - Crear abogado
- `GET /lawyers?page=1&limit=10` - Listar abogados (paginado)
- `GET /lawyers/:id` - Obtener abogado por ID

### Gestión de Demandas

- `POST /lawsuits` - Crear demanda
- `GET /lawsuits?status=pending&lawyer_id=uuid` - Listar demandas (con filtros opcionales)
- `PUT /lawsuits/:id/assign` - Asignar abogado a una demanda

### Reportes

- `GET /reports/lawyers/:id/lawsuits` - Listado de demandas por abogado

---

## 📂 Estructura del Proyecto
Se uso arquitectura MVC con capas de Repository, Service y Controller.

```
src/
├── config/
│   ├── database.js           # Configuración de BD
│   └── swagger.js            # Configuración Swagger
├── controllers/              # Controladores HTTP
├── middlewares/
│   ├── auth.js               # Middleware de autenticación
│   ├── errorHandler.js       # Manejo centralizado de errores
│   └── validation.js         # Validación con Joi
├── migrations/               # Migraciones BD
├── models/                   # Modelos Sequelize
├── repositories/             # Lógica BD (Accesso a datos)
├── routes/                   # Definición de rutas
├── seeders/                  # Datos de prueba
├── services/                 # Lógica de negocio
├── utils/
│   ├── auth.js               # Creación de token
│   └── logger.js             # Configuración de logs
└── app.js                    # Punto de entrada principal
```

## 🗃️ Modelos de Datos

### Abogado (Lawyer)
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "specialization": "string",
  "status": "active | inactive",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Demanda (Lawsuit)
```json
{
  "id": "uuid",
  "case_number": "string",
  "plaintiff": "string",
  "defendant": "string",
  "case_type": "civil | criminal | labor | commercial",
  "status": "pending | assigned | resolved",
  "lawyer_id": "uuid | null",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Usuario (User)
Para login con JWT (Creados con seeders)

```json
{
  "id": "uuid",
  "username": "string",
  "password": "string (hashed)",
  "role": "admin | operator",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 📖 Ejemplos de Uso (funcionamiento API)

- Iniciar sesión
![Inciar Sesión](public/01%20-%20Iniciar%20Sesión.gif)


- Crear una demanda
![Crear una demanda](public/02%20-%20Crear%20una%20demanda.gif)

- Obtener lista de demandas
![Obtener lista de demandas](public/03%20-%20Obtener%20lista%20de%20demandas.gif)

- Obtener lista de abogados
![Obtener lista de abogados](public/04%20-%20Obtener%20lista%20de%20abogados.gif)

- Obtener abogado
![Obtener abogado](public/05%20-%20Obtener%20abogado.gif)

- Crear un abogado
![Crear un abogado](public/06%20-%20Crear%20un%20abogado.gif)

- Asignar abogado a demanda
![Asignar abogado a demanda](public/07%20-%20Asignar-abogado-a-demanda.gif)

- Obtener demandas por abogado
![Obtener demandas por abogado](public/08%20-%20Demandas-por-abogado.gif)
