/**
 * Controlador del menú digital.
 *
 * Este archivo expone la ruta para generar y devolver el PDF del menú,
 * usando el servicio de generación de menú y cargando el resultado a Cloudinary.
 */
import { generarMenuPDF } from '../services/Menu.service.js';

/**
 * GET /menu/pdf
 *
 * Genera un PDF del menú con el servicio correspondiente y devuelve
 * las URLs generadas para vista previa y descarga.
 *
 * @param {Object} _req - Objeto de petición Express (sin uso aquí).
 * @param {Object} res - Objeto de respuesta Express.
 */
const getMenuPDF = async (_req, res) => {
    try {
        const urlData = await generarMenuPDF();
        res.status(200).json({
            message: 'PDF generado y subido exitosamente a Cloudinary',
            success: true,
            data: {
                // URL base (parámetro por defecto)
                url: urlData.secure_url,
                // URLs con flags específicos
                previewUrl: urlData.previewUrl,    // Ver en navegador (inline)
                downloadUrl: urlData.downloadUrl,  // Descargar
                // Para referencia
                publicId: urlData.publicId,
            }
        });
    } catch (e) {
        console.error('Error en getMenuPDF:', e);
        res.status(500).json({ 
            success: false,
            error: e.message 
        });
    }
};

export default { getMenuPDF };