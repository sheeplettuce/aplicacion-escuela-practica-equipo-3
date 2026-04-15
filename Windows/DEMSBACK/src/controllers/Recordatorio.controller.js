/**
 * Controlador de recordatorios.
 *
 * Envía correos de recordatorio para reservaciones próximas y permite reenviar
 * tickets por correo a partir de pedidos.
 */
import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail, sendTicketEmail, getPedidoById } from '../services/Email.service.js';

/**
 * POST /recordatorios/enviar
 *
 * Envía por correo los recordatorios de las reservaciones próximas.
 * Recorre la lista de reservaciones próximas y genera un mensaje para cada cliente.
 *
 * @param {Object} req - Petición Express.
 * @param {Object} res - Respuesta Express.
 */
export const enviarRecordatorios = async (req, res) => {
  try {
    const reservaciones = await getReservacionesProximas();

    for (const r of reservaciones) {
      await sendReminderEmail(r.Correo, r.Fecha, r.NombreCliente);
    }

    res.status(200).json({
      message: 'Correos enviados',
      total: reservaciones.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al enviar correos',
      details: error.message
    });
  }
};

/**
 * POST /recordatorios/enviar-ticket/:id?correo=...
 *
 * Reenvía por correo el ticket de un pedido existente.
 * Valida el correo en la query y busca el pedido por id.
 *
 * @param {Object} req - Petición Express con params.id y query.correo.
 * @param {Object} res - Respuesta Express.
 */
export const enviarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo } = req.query;

    if (!correo) {
      return res.status(400).json({ error: 'El correo es requerido' });
    }

    const pedido = await getPedidoById(id); // 👈 directo, sin PedidoService

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.correo = correo;

    await sendTicketEmail(pedido);

    res.json({ mensaje: 'Ticket enviado', destinatario: correo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar ticket' });
  }
};