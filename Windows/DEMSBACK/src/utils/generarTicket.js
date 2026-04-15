import PDFDocument from 'pdfkit';
import { uploadPDFToCloudinary } from '../services/Cloudinary.service.js';

export const generarTicket = (pedido) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    // Captura el PDF en memoria en lugar de escribirlo a disco
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('DEMS! LOMA BONITA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`${pedido.ubicacion} - ${pedido.folio}`);
    if (pedido.correo) {
      doc.text(`Correo: ${pedido.correo}`);
    }
    doc.text(`Fecha: ${pedido.fecha}`);
    doc.moveDown();
    doc.text('--- Detalles ---');

    pedido.productos.forEach(p => {
      doc.text(`${p.cantidad}x ${p.nombre} - $${p.precio}: $${p.cantidad * p.precio}`);
    });

    doc.moveDown();
    doc.text(`Total: $${pedido.total}`);

    doc.end();
  });
};

/**
 * Genera un ticket PDF y lo sube a Cloudinary
 * @param {Object} pedido - Datos del pedido
 * @returns {Promise<{url: string, previewUrl: string, secure_url: string}>}
 */
export const generarTicketYSubir = async (pedido) => {
  const pdfBuffer = await generarTicket(pedido);
  const nombreArchivo = `ticket-${Date.now()}`;
  return await uploadPDFToCloudinary(pdfBuffer, nombreArchivo, 'tickets');
};