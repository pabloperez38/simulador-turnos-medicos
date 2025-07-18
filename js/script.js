const TIEMPO_POR_TURNO = 15;
let turnos = [];
let proximoTurnoId = 1;

document.getElementById("formTurno").addEventListener("submit", function (e) {
    e.preventDefault();
    registrarTurno();
});

let listaEspecialidades = [];

async function cargarOpcionesEspecialidad() {
    const select = document.getElementById("especialidad");

    try {
        const response = await fetch("especialidades.json");
        const especialidades = await response.json();
        listaEspecialidades = especialidades;

        especialidades.forEach((esp, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = esp.name;
            select.appendChild(option);
        });

        // Mostrar nombre del médico al seleccionar
        select.addEventListener("change", function () {
            const idx = parseInt(this.value);
            if (!isNaN(idx)) {
                document.getElementById("nombreMedico").textContent =
                    "Médico: " + listaEspecialidades[idx].medico;
            } else {
                document.getElementById("nombreMedico").textContent = "";
            }
        });

        cargarOpcionesMedico();
    } catch (error) {
        fncSweetAlert("error", `Error al cargar especialidades`, null);
    }
}

function cargarOpcionesMedico() {
    const selectMedico = document.getElementById("selectMedico");
    const medicosUnicos = [
        ...new Set(listaEspecialidades.map((esp) => esp.medico)),
    ];

    medicosUnicos.forEach((medico) => {
        const option = document.createElement("option");
        option.value = medico;
        option.textContent = medico;
        selectMedico.appendChild(option);
    });
}

function registrarTurno() {
    const inputNombre = document.getElementById("nombre");
    const inputEdad = document.getElementById("edad");
    const inputEspecialidad = document.getElementById("especialidad");

    const nombre = inputNombre.value.trim();
    const edad = parseInt(inputEdad.value);
    const especialidadIndex = parseInt(inputEspecialidad.value);
    const especialidadObj = listaEspecialidades[especialidadIndex];

    // Validación campo nombre vacío
    if (!nombre) {
        fncSweetAlert("error", "El nombre no puede estar vacío.", () => {
            inputNombre.focus(); //
        });
        return;
    }

    // Validación nombre con números

    if (/\d/.test(nombre)) {
        fncSweetAlert("error", "El nombre no debe contener números.", () => {
            inputNombre.focus();
        });
        return;
    }

    // Validación edad

    if (isNaN(edad) || edad <= 0) {
        fncSweetAlert(
            "error",
            "La edad debe ser un número mayor que cero.",
            () => {
                inputEdad.focus(); //
            }
        );
        return;
    }

    // Validación especialidad no seleccionada
    if (isNaN(especialidadIndex)) {
        fncSweetAlert("error", "Debe seleccionar una especialidad.", () => {
            inputEspecialidad.focus();
        });
        return;
    }

    // Crear turno
    const nuevoTurno = {
        id: proximoTurnoId++,
        nombre,
        edad,
        especialidad: especialidadObj.name,
        medico: especialidadObj.medico,
        horaRegistro: new Date().toLocaleTimeString(),
    };

    // Guardar turno
    turnos.push(nuevoTurno);
    guardarTurnosEnLocalStorage();
    agregarTurnoATabla(nuevoTurno);

    // Limpiar formulario
    document.getElementById("formTurno").reset();

    // Mostrar confirmación
    fncSweetAlert("success", `Turno registrado para ${nombre}`, null);

    document.getElementById("nombreMedico").style.display = "none";
}

function agregarTurnoATabla(turno) {
    const tbody = document.querySelector("#tablaTurnos tbody");
    const fila = document.createElement("tr");
    fila.setAttribute("data-id", turno.id);

    fila.innerHTML = `
    <td>${turno.id}</td>
    <td>${turno.nombre}</td>
    <td>${turno.edad}</td>
    <td>${turno.especialidad}</td>
    <td>${turno.medico}</td>
    <td>${turno.horaRegistro}</td>
    <td>
      <button class="btn btn-sm btn-danger" onclick="eliminarTurno(${turno.id})">Eliminar</button>
    </td>
`;
    tbody.appendChild(fila);
}

function eliminarTurno(id) {
    turnos = turnos.filter((t) => t.id !== id);

    guardarTurnosEnLocalStorage();

    // Elimina la fila de la tabla
    const fila = document.querySelector(
        `#tablaTurnos tbody tr[data-id="${id}"]`
    );
    if (fila) fila.remove();
    fncSweetAlert("success", `Turno #${id} eliminado`, null);

    imprimir("");
}

function guardarTurnosEnLocalStorage() {
    localStorage.setItem("turnos", JSON.stringify(turnos));
}

function cargarTurnosDesdeLocalStorage() {
    const datos = localStorage.getItem("turnos");
    if (datos) {
        turnos = JSON.parse(datos);
        if (turnos.length > 0) {
            proximoTurnoId = Math.max(...turnos.map((t) => t.id)) + 1;
            turnos.forEach((t) => agregarTurnoATabla(t));
        }
    }
}

document.getElementById("selectMedico").addEventListener("change", function () {
    const medicoSeleccionado = this.value;

    // Limpiar estadísticas o tiempos anteriores
    document.getElementById("salida").textContent = "";

    const tbody = document.querySelector("#tablaTurnos tbody");
    tbody.innerHTML = ""; // limpiar tabla

    const turnosFiltrados = medicoSeleccionado
        ? turnos.filter((t) => t.medico === medicoSeleccionado)
        : turnos;

    if (turnosFiltrados.length === 0 && medicoSeleccionado !== "") {
        fncSweetAlert("error", "No hay turnos para este médico", null);
    } else {
        turnosFiltrados.forEach((t) => agregarTurnoATabla(t));
    }
});

function calcularTiempoEspera() {
    imprimir("");

    const medicoSeleccionado = document.getElementById("selectMedico").value;
    const turnosFiltrados = medicoSeleccionado
        ? turnos.filter((t) => t.medico === medicoSeleccionado)
        : turnos;

    if (turnosFiltrados.length === 0) {
        fncSweetAlert("info", "No hay turnos registrados", null);
        return;
    }

    let salida = `=== TIEMPOS DE ESPERA ${
        medicoSeleccionado ? "DEL MÉDICO " + medicoSeleccionado : ""
    } ===\n`;

    turnosFiltrados.forEach((turno, index) => {
        const tiempoEspera = index * TIEMPO_POR_TURNO;
        salida += `#${turno.id} - ${turno.nombre} (${turno.edad} años) - ${turno.especialidad}: ${tiempoEspera} mins\n`;
    });

    imprimir(salida);
}

function mostrarEstadisticas() {
    imprimir("");

    const medicoSeleccionado = document.getElementById("selectMedico").value;
    const turnosFiltrados = medicoSeleccionado
        ? turnos.filter((t) => t.medico === medicoSeleccionado)
        : turnos;

    const totalTurnos = turnosFiltrados.length;

    if (totalTurnos === 0) {
        fncSweetAlert("info", "No hay turnos registrados", null);
        return;
    }

    const edadPromedio =
        turnosFiltrados.reduce((sum, t) => sum + t.edad, 0) / totalTurnos;

    let salida = `=== ESTADÍSTICAS ${
        medicoSeleccionado ? "DEL MÉDICO " + medicoSeleccionado : ""
    } ===\n`;
    salida += `Total turnos: ${totalTurnos}\n`;
    salida += `Edad promedio: ${edadPromedio.toFixed(1)} años\n`;

    salida += "\nDistribución por especialidad:\n";

    // Si querés solo las especialidades que tenga este médico:
    const especialidadesUnicas = [
        ...new Set(turnosFiltrados.map((t) => t.especialidad)),
    ];

    especialidadesUnicas.forEach((esp) => {
        const count = turnosFiltrados.filter(
            (t) => t.especialidad === esp
        ).length;
        const porcentaje = ((count / totalTurnos) * 100).toFixed(1);
        salida += `${esp}: ${count} turnos (${porcentaje}%)\n`;
    });

    imprimir(salida);
}

function imprimir(mensaje) {
    document.getElementById("salida").textContent = mensaje;
}

/*=============================================
  Función Sweetalert
  =============================================*/

function fncSweetAlert(type, text, url) {
    switch (type) {
        /*=============================================
          Cuando ocurre un error
          =============================================*/

        case "error":
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error",
                showConfirmButton: false,
                timer: 2000,
                text: text,
                didClose: () => {
                    if (typeof url === "function") {
                        url();
                    }
                },
            });

            break;

        /*=============================================
          Cuando es correcto
          =============================================*/

        case "success":
            if (url == null) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    text: text,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    position: "top-end",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    text: text,
                }).then(() => {
                    window.location = url;
                });
            }

            break;

        /*=============================================
          Cuando es info
          =============================================*/

        case "info":
            if (url == null) {
                Swal.fire({
                    position: "top-end",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 1500,
                    text: text,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    position: "top-end",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 1500,
                    text: text,
                }).then(() => {
                    window.location = url;
                });
            }

            break;

        /*=============================================
          Cuando estamos precargando
          =============================================*/

        case "loading":
            Swal.fire({
                position: "top-end",
                allowOutsideClick: false,
                icon: "info",
                text: text,
            });
            Swal.showLoading();

            break;

        /*=============================================
          Cuando necesitamos cerrar la alerta suave
          =============================================*/

        case "close":
            Swal.close();

            break;
    }
}

// Cargar datos al inicio
cargarTurnosDesdeLocalStorage();
cargarOpcionesEspecialidad();
