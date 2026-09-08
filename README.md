# 🏥 MediCore - Plataforma SaaS de Gestión Clínica

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

## 📋 Sobre el Proyecto

MediCore es una plataforma SaaS multi-tenant para la gestión integral de consultorios médicos: historias clínicas, turnos, recordatorios automáticos y suscripciones pagas. Cada profesional que se registra opera con sus propios pacientes y datos aislados del resto de las cuentas.

> **Nota de Seguridad:** Este repositorio es una versión pública y sanitizada de un proyecto privado. Se removieron credenciales, datos personales reales, variables de entorno y el historial de commits original. Los datos de ejemplo (pacientes, credenciales demo) son ficticios.

## ✨ Características Principales

* **Autenticación y cuentas:** registro, login con JWT, verificación de cuenta por email y recuperación de contraseña (reset por token con expiración).
* **Multi-tenant:** cada médico tiene su propio conjunto de pacientes; el mismo DNI puede existir en cuentas de distintos profesionales sin colisionar.
* **Historias clínicas:** alta y edición de pacientes, evoluciones clínicas cronológicas, carga de estudios/multimedia y exportación de la historia clínica a PDF.
* **Agenda de turnos:** calendario interactivo para crear, editar y consultar turnos por paciente.
* **Recordatorios automáticos:** envío de recordatorios de turno por email y sincronización opcional con Google Calendar (OAuth con Google).
* **Suscripciones SaaS:** planes de Prueba, Básico y Premium con estado de pago, vencimiento y modo de solo lectura al expirar; cobro de suscripciones integrado con **Mercado Pago**.
* **Panel de administración:** cuenta superadmin para gestión interna de la plataforma.
* **Reportes:** panel de estadísticas de la actividad del consultorio.
* **Landing page interactiva:** página de producto con mockups animados de las pantallas principales.
* **Modo claro/oscuro** en toda la interfaz.

## 🏗️ Arquitectura y Tecnologías

Arquitectura cliente-servidor desacoplada, con API REST y SPA independientes.

### Backend
* **Java 21** + **Spring Boot 3.2**
* **Spring Security** con autenticación **JWT** (jjwt)
* **Spring Data JPA** / Hibernate sobre **PostgreSQL**
* **Spring Mail** (SMTP) para verificación de cuenta, recuperación de contraseña y recordatorios de turnos
* **Google Calendar API** para sincronización de turnos
* **SDK de Mercado Pago** para el cobro de suscripciones
* Empaquetado con **Maven** y **Docker**

### Frontend
* **React 19** + **Vite 7**
* **React Router 7**
* **Tailwind CSS 4**
* **Axios** para consumo de la API
* **react-big-calendar** para la agenda de turnos
* **Recharts** para reportes
* **Framer Motion** para animaciones (incluida la landing page)
* **jsPDF** + **html2canvas** para exportar historias clínicas a PDF
* **@react-oauth/google** para la sincronización con Google

## ⚙️ Configuración Local (Entorno de Desarrollo)

### 1. Backend (Spring Boot)

1. Ir a la carpeta `/backend`.
2. Copiar `src/main/resources/application-local.properties.example` a `src/main/resources/application-local.properties` y completar los datos de conexión a tu base de datos PostgreSQL y credenciales SMTP.
3. Copiar `.env.example` a `.env` y completar las variables de Mercado Pago (`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`) y, si no usás el archivo de properties, las variables de base de datos y correo.
4. Ejecutar con el perfil `local`:
   ```bash
   ./mvnw spring-boot:run
   ```
   El backend queda disponible en `http://localhost:8080`.

> Al iniciar por primera vez, el backend crea automáticamente cuentas de ejemplo (`admin.demo`, `usuario.prueba`, `usuario.basico`, `usuario.premium`) para probar los distintos planes de suscripción. **Cambiá esas credenciales antes de exponer el proyecto en un entorno público.**

### 2. Frontend (React)

1. Ir a la carpeta `/frontend`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar `.env.example` a `.env` y completar `VITE_GOOGLE_CLIENT_ID` si querés probar la sincronización con Google Calendar (opcional; sin este valor la app funciona igual, solo queda deshabilitada esa función).
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend queda disponible en `http://localhost:5173` y espera que la API esté corriendo en `http://localhost:8080`.

## 🔒 Notas para producción

* Rotá todas las credenciales de ejemplo antes de desplegar (usuarios seed, tokens de Mercado Pago, credenciales SMTP y de base de datos).
* Configurá `CORS`/orígenes permitidos en `SecurityConfig` y `BackendApplication` según tu dominio real.
* Las variables sensibles siempre deben cargarse por entorno (`.env` / variables del proveedor de hosting), nunca commiteadas.
