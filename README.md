# DEMS! — Dinner Environment Management System

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-Capacitor-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

---

## Proyecto Escuela Práctica

**Grupo y Carrera:**
Tecnologías de la Información — Desarrollo de Software Multiplataforma
Universidad Tecnológica de Aguascalientes

**Equipo:** Los Primos y el Aceite

**Líder del proyecto:** Carlos Santiago Delgado Oliva

**Docente:** Mtro. Francisco Javier Trujillo Silva

---

## Integrantes

| Matrícula | Nombre |
|-----------|--------|
| 240272 | Corral Rodriguez Yeraldin Alexandra |
| 244181 | Delgado Oliva Carlos Santiago |
| 240284 | Huerta Rodriguez Aaron |
| 240386 | Julio Enrique Zariñan Rodriguez |

---

## Descripción del proyecto

**DEMS!** es un sistema de gestión integral desarrollado para la cenaduría *"Loma Bonita"*. Automatiza operaciones que anteriormente se realizaban de forma manual, incluyendo gestión de reservaciones, toma de pedidos, administración del menú, cobros y generación de reportes de ventas en tiempo real.

El sistema está compuesto por tres módulos principales:

| Módulo | Descripción | Puerto |
|--------|-------------|--------|
| ![Node](https://img.shields.io/badge/Backend-API_REST-339933?style=flat-square&logo=nodedotjs&logoColor=white) | API REST en Node.js + Express + SQL Server | `3000` |
| ![Angular](https://img.shields.io/badge/Frontend_Web-Angular-DD0031?style=flat-square&logo=angular&logoColor=white) | Aplicación web / escritorio con Angular + Electron | `4200` |
| ![Ionic](https://img.shields.io/badge/Movil-Ionic_Capacitor-3880FF?style=flat-square&logo=ionic&logoColor=white) | App móvil Android con Ionic + Capacitor | — |

---

## Tecnologías utilizadas

### Frontend
![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=flat-square&logo=ionic&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat-square&logo=capacitor&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-338?style=flat-square&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=flat-square&logo=gmail&logoColor=white)
![PDFKit](https://img.shields.io/badge/PDFKit-FF0000?style=flat-square&logo=adobeacrobatreader&logoColor=white)

---

## Instrucciones de ejecución

### ![Node](https://img.shields.io/badge/1._Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)

```bash
cd Windows/DEMSBACK
npm install
npm start
```

> Servidor disponible en `http://localhost:3000`

---

### ![Angular](https://img.shields.io/badge/2._Frontend_Web-DD0031?style=flat-square&logo=angular&logoColor=white)

```bash
cd Windows/DEMSFRONT
npm install
ng serve
```

> Aplicación disponible en `http://localhost:4200`

---

### ![Electron](https://img.shields.io/badge/3._Escritorio_(Electron)-47848F?style=flat-square&logo=electron&logoColor=white)

```bash
cd Windows/electron
npm install
npm start
```

---

### ![Ionic](https://img.shields.io/badge/4._Movil_(Ionic)-3880FF?style=flat-square&logo=ionic&logoColor=white)

```bash
cd DESMobile
npm install
ionic serve
```