# 🏥 Simulador de Turnos Médicos

Este proyecto es un simulador de turnos médicos desarrollado con **JavaScript**, que permite registrar, visualizar, filtrar y analizar turnos para distintas especialidades médicas.

## 🚀 Funcionalidades

-   Registrar turnos con nombre, edad y especialidad.
-   Mostrar automáticamente el médico correspondiente.
-   Guardado automático en **localStorage** del navegador.
-   Mostrar lista de turnos en una tabla dinámica.
-   Filtrar turnos por médico.
-   Calcular **tiempos de espera** estimados (15 minutos por paciente).
-   Ver **estadísticas** por especialidad y edad promedio.
-   Eliminar turnos individuales con confirmación.
-   Validaciones para campos obligatorios y formato de datos.
-   Alertas personalizadas con **SweetAlert2**.

## 🧑‍💻 Tecnologías utilizadas

-   HTML5 + CSS3 (interfaz)
-   JavaScript (lógica del simulador)
-   [SweetAlert2](https://sweetalert2.github.io/) (notificaciones)
-   `localStorage` (persistencia en navegador)
-   JSON externo (`especialidades.json`)

## 📦 Estructura del proyecto

```
📁 simulador-turnos-medicos/
├── index.html
├── especialidades.json
├── 📁 css/
│   └── style.css
├── 📁 js/
│   └── script.js
└── README.md
```

## 📋 Cómo usarlo

1. Cloná el repositorio:

    ```bash
    git clone https://github.com/pabloperez38/simulador-turnos-medicos.git
    ```

2. Abrí `index.html` en tu navegador.

3. Completá el formulario para registrar turnos.

4. Usá los filtros y botones para ver tiempos de espera o estadísticas.

> ⚠️ Asegurate de tener un archivo `especialidades.json` con el formato adecuado:

```json
[
    {
        "name": "Cardiología",
        "medico": "Dra. Marta García"
    },
    {
        "name": "Dermatología",
        "medico": "Dr. Juan Pérez"
    }
]
```

## 📝 Licencia

Este proyecto está publicado bajo la licencia MIT. Podés usarlo, modificarlo y compartirlo libremente.

---

👨‍⚕️ _Desarrollado con fines educativos para simular la gestión de turnos en un entorno médico._
