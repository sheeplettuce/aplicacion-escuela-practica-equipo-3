/**
 * Controlador de reportes.
 *
 * Genera resúmenes de ventas y métricas comerciales en un rango de fechas,
 * y también devuelve el historial de cambios del sistema.
 */
import svc from '../services/Reportes.service.js';

/**
 * GET /reportes/resumen?desde=...&hasta=...
 *
 * Consolida métricas de ventas y top platillos en un rango de fechas.
 *
 * @param {Object} req - Petición Express con query params desde y hasta.
 * @param {Object} res - Respuesta Express.
 */
const getResumen = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        if (!desde || !hasta)
            return res.status(400).json({ error: 'desde y hasta son requeridos' });

        const [ventas, topPlatillos, metodosPago] = await Promise.all([
            svc.getHistorialVentas(desde, hasta),
            svc.getTopPlatillos(desde, hasta),
            svc.getMetodosPago(desde, hasta)
        ]);

        const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
        const ticketPromedio = ventas.length > 0 ? totalVentas / ventas.length : 0;

        const metodoPrincipal = metodosPago.length > 0
            ? metodosPago.reduce((prev, curr) => curr.total > prev.total ? curr : prev)
            : { metodo: 'N/A', total: 0 };

        const totalPagos = metodosPago.reduce((sum, m) => sum + (m.total || 0), 0);
        const porcentajeMetodo = totalPagos > 0
            ? Math.round((metodoPrincipal.total / totalPagos) * 100)
            : 0;

        res.json({
            totalVentas,
            cantidadVentas: ventas.length,
            ticketPromedio: Math.round(ticketPromedio),
            metodoPrincipal: metodoPrincipal.metodo,
            porcentajeMetodo,
            historialVentas: ventas,
            topPlatillos
        });
    } catch (e) {
        console.error('❌ Error en getResumen:', e);
        res.status(500).json({ error: e.message });
    }
};

// GET /reportes/historial-cambios
// Obtiene el historial de cambios guardados en el sistema.
const getHistorialCambios = async (_req, res) => {
    try {
        const data = await svc.getHistorialCambios();
        res.json(data);
    } catch (e) {
        console.error('❌ Error en getHistorialCambios:', e);
        res.status(500).json({ error: e.message });
    }
};

export default { getResumen, getHistorialCambios };