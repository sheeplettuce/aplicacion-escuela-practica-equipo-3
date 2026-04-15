/**
 * Controlador de reservaciones.
 *
 * Maneja reservas de clientes: listado, próximas citas, creación,
 * actualización, eliminación y notificación SSE.
 */
import svc from '../services/Reservaciones.service.js';
import { sendEventToAll } from '../routes/sse.route.js';

/**
 * GET /Reservaciones
 *
 * Devuelve todas las reservaciones registradas.
 *
 * @param {Object} _req - Petición Express.
 * @param {Object} res - Respuesta Express.
 */
const getAll = async (_req, res) => {
    try {
        const data = await svc.getReservaciones();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /Reservaciones/proximas
// Devuelve las reservaciones próximas que requieren atención.
const getProximas = async (_req, res) => {
    try {
        const data = await svc.getReservacionesProximas();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /Reservaciones/:id
// Obtiene los datos de una reservación específica.
const getById = async (req, res) => {
    try {
        const reservacion = await svc.getReservacionById(req.params.id);
        if (!reservacion) return res.status(404).json({ error: 'Reservación no encontrada' });
        res.json(reservacion);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /Reservaciones
// Crea una nueva reservación para un cliente.
const create = async (req, res) => {
    try {
        const { NombreCliente, Telefono, Correo, Fecha, NoPersonas, idTrabajador } = req.body;

        if (!NombreCliente || !Fecha || !NoPersonas || !idTrabajador)
            return res.status(400).json({ error: 'NombreCliente, Fecha, NoPersonas e idTrabajador son requeridos' });

        const id = await svc.createReservacion({ NombreCliente, Telefono, Correo, Fecha, NoPersonas, idTrabajador });

        sendEventToAll('nueva_reservacion', { NombreCliente, Telefono, Correo, Fecha, NoPersonas, idTrabajador, idReservacion: id });

        res.status(201).json({ message: 'Reservación creada', idReservacion: id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /Reservaciones/:id
// Actualiza una reservación existente.
const update = async (req, res) => {
    try {
        const { NombreCliente, Telefono, Correo, Fecha, NoPersonas, Estado } = req.body;

        if (!NombreCliente || !Fecha || !NoPersonas || !Estado)
            return res.status(400).json({ error: 'NombreCliente, Fecha, NoPersonas y Estado son requeridos' });

        const ok = await svc.updateReservacion(req.params.id, { NombreCliente, Telefono, Correo, Fecha, NoPersonas, Estado });
        if (!ok) return res.status(404).json({ error: 'Reservación no encontrada' });

        sendEventToAll('reservacion_actualizada', { id: req.params.id, NombreCliente, Telefono, Correo, Fecha, NoPersonas, Estado });

        res.json({ message: 'Reservación actualizada' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE /Reservaciones/:id
// Elimina una reservación.
const remove = async (req, res) => {
    try {
        const ok = await svc.deleteReservacion(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Reservación no encontrada' });

        sendEventToAll('reservacion_eliminada', { id: req.params.id });

        res.json({ message: 'Reservación eliminada' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default { getAll, getProximas, getById, create, update, remove };