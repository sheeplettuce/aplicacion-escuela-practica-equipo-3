/**
 * Controlador de platillos.
 *
 * Administra el catálogo de platillos y entrega datos para el menú digital,
 * incluyendo operaciones CRUD y estructuras de presentación.
 */
import svc from '../services/Platillos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';

/**
 * GET /platillos
 *
 * Devuelve todos los platillos registrados en el sistema.
 *
 * @param {Object} _req - Petición Express.
 * @param {Object} res - Respuesta Express.
 */
const getAll = async (_req, res) => {
    try {
        const data = await svc.getPlatillos();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/completo
// Entrega la información completa de platillos, incluyendo datos enriquecidos.
const getCompleto = async (_req, res) => {
    try {
        const data = await svc.getPlatillosCompletos();
        console.log("Enviando platillos completos: ", data);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/structure
// Devuelve la estructura de categorías/menus para los platillos.
const getStructure = async (_req, res) => {
    try {
        const data = await svc.getStructure();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/menu
// Devuelve el menú digital para ser mostrado al cliente.
const getMenu = async (_req, res) => {
    try {
        const menu = await svc.getMenuDigital();
        res.json(menu);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/:id
// Obtiene los datos de un platillo específico.
const getById = async (req, res) => {
    try {
        const platillo = await svc.getPlatilloById(req.params.id);
        if (!platillo) return res.status(404).json({ error: 'Platillo no encontrado' });
        res.json(platillo);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /platillos
// Crea un nuevo platillo en el catálogo.
const create = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, idCategoria } = req.body;
        if (!Nombre || !Precio || !idCategoria)
            return res.status(400).json({ error: 'Nombre, Precio e idCategoria son requeridos' });

        const id = await svc.createPlatillo({ Nombre, Descripcion, Precio, idCategoria });

        sendEventToAll('nuevo_platillo', { Nombre, Descripcion, Precio, idCategoria, idPlatillo: id });

        res.status(201).json({ message: 'Platillo creado', idPlatillo: id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /platillos/:id
// Actualiza los datos de un platillo existente.
const update = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, idCategoria } = req.body;
        if (!Nombre || !Precio || !idCategoria)
            return res.status(400).json({ error: 'Nombre, Precio e idCategoria son requeridos' });

        const ok = await svc.updatePlatillo(req.params.id, { Nombre, Descripcion, Precio, idCategoria });
        if (!ok) return res.status(404).json({ error: 'Platillo no encontrado' });

        sendEventToAll('platillo_actualizado', { id: req.params.id, Nombre, Descripcion, Precio, idCategoria });

        res.json({ message: 'Platillo actualizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE /platillos/:id
// Desactiva un platillo del catálogo.
const remove = async (req, res) => {
    try {
        const ok = await svc.deletePlatillo(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Platillo no encontrado' });

        sendEventToAll('platillo_eliminado', { id: req.params.id });

        res.json({ message: 'Platillo desactivado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    getAll,
    getCompleto,
    getStructure,
    getMenu,
    getById,
    create,
    update,
    remove
};