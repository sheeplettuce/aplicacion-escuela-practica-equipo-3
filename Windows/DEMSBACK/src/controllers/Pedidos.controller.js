/**
 * Controlador de pedidos.
 *
 * Administra la lógica de negocio de pedidos: listado, detalles, creación,
 * actualización, cambio de estado y cancelación.
 * Notifica eventos en tiempo real mediante SSE.
 */
import svc from '../services/Pedidos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';

/**
 * GET /pedidos
 *
 * Recupera todos los pedidos registrados.
 *
 * @param {Object} _req - Petición Express.
 * @param {Object} res - Respuesta Express.
 */
const getAll = async (_req, res) => {
    try {
        const data = await svc.getPedidos();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /pedidos/:id/detalles
// Obtiene los detalles de un pedido específico.
const getDetalles = async (req, res) => {
    try {
        const data = await svc.getDetalles(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /pedidos
// Crea un nuevo pedido y emite un evento SSE para notificarlo.
const create = async (req, res) => {
    try {
        const { TrabajadorId, Tipo, NoMesa, Platillos } = req.body;

        if (!TrabajadorId || Tipo === undefined || !Platillos)
            return res.status(400).json({ error: 'Datos incompletos' });

        console.log('Crear pedido - req.body:', { TrabajadorId, Tipo, NoMesa, Platillos });
        const idPedido = await svc.createPedido({ TrabajadorId, Tipo, NoMesa, Platillos });

        sendEventToAll('nuevo_pedido', { idPedido, TrabajadorId, Tipo, NoMesa, Fecha: new Date(), Platillos });

        res.status(201).json({ message: 'Pedido registrado', id: idPedido });
    } catch (e) {
        console.log('Error al crear pedido:', e);
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id
// Actualiza datos del pedido y notifica el cambio en tiempo real.
const update = async (req, res) => {
    try {
        console.log('Actualizar pedido - req.body:', req.body);
        const { TrabajadorId, Tipo, NoMesa, Platillos } = req.body;
        if (!Platillos || !Array.isArray(Platillos) || Platillos.length === 0) {
            return res.status(400).json({ error: 'Platillos inválidos' });
        }

        await svc.updatePedido(req.params.id, { TrabajadorId, Tipo, NoMesa, Platillos });
        sendEventToAll('pedido_actualizado', { id: req.params.id, TrabajadorId, Tipo, NoMesa, Platillos });
        res.json({ message: 'Pedido actualizado' });
    } catch (e) {
        console.log('Error al actualizar pedido:', e);
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id/ready
// Marca un pedido como listo y avisa al cliente/servicio.
const ready = async (req, res) => {
    try {
        console.log(`Marcar pedido ${req.params.id} como listo`);
        await svc.marcarReady(req.params.id);
        
        sendEventToAll('pedido_ready', { id: req.params.id });

        res.json({ message: 'Pedido marcado como listo' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


// PUT /pedidos/:id/finalizar
// Finaliza un pedido, cerrando su ciclo de vida.
const finalizar = async (req, res) => {
    try {
        await svc.finalizarPedido(req.params.id);

        sendEventToAll('pedido_finalizado', { id: req.params.id });

        res.json({ message: 'Pedido finalizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id/cancelar
// Cancela un pedido si aún no ha sido finalizado.
const cancelar = async (req, res) => {
    try {
        const ok = await svc.cancelar(req.params.id);

        if (!ok) {
            return res.status(400).json({
                error: 'No se pudo cancelar (pedido no existe o ya está terminado)'
            });
        }

        sendEventToAll('pedido_cancelado', { id: req.params.id });

        res.json({ message: 'Pedido cancelado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    getAll,
    getDetalles,
    create,
    update,
    ready,
    finalizar,
    cancelar
};