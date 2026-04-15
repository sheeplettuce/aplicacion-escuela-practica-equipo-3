import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { generarTicket } from '../utils/generarTicket.js';
import { getConnection, sql } from '../config/connection.js'; // 👈 agregar

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'demslomabonita@gmail.com',
    pass: 'drgnwsaiqgnqnirq'
  }
});

function generarHTML(fecha, nombre) {
  const ruta = path.resolve('src/assets/templates/reservacion.html');
  let html = fs.readFileSync(ruta, 'utf-8');
  html = html.replace('{{fecha}}', fecha);
  html = html.replace('{{nombre}}', nombre);
  return html;
}

export const sendReminderEmail = async (correo, fecha, nombre) => {
  try {
    const html = generarHTML(fecha, nombre);
    await transporter.sendMail({
      from: '"Reservaciones" <demslomabonita@gmail.com>',
      to: correo,
      subject: 'Recordatorio de tu reservación',
      html: html
    });
    console.log(`Correo enviado a ${correo}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

export const sendTicketEmail = async (pedido) => {
  try {
    const pdfBuffer = await generarTicket(pedido);
    await transporter.sendMail({
      from: '"Tickets" <demslomabonita@gmail.com>',
      to: pedido.correo,
      subject: 'Tu ticket de compra 🧾',
      text: 'Gracias por tu compra, aquí está tu ticket.',
      attachments: [
        {
          filename: 'ticket.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
    console.log(`Ticket enviado a: ${pedido.correo}`);
  } catch (error) {
    console.error('Error enviando ticket:', error);
    throw error;
  }
};

// 👇 solo esta función, sin export default con cosas que no existen aquí
export const getPedidoById = async (idPedido) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('idPedido', sql.Int, idPedido)
    .execute('sp_GetDetallesPedidoEstructura');

  const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
  const detalles = raw ? JSON.parse(raw) : [];

  return {
    id: idPedido,
    productos: detalles.map(d => ({
      nombre: d.Platillo.nombre,
      precio: d.PrecioUnitario * d.Cantidad
    })),
    total: detalles.reduce((acc, d) => acc + (d.PrecioUnitario * d.Cantidad), 0),
    fecha: new Date()
  };
};