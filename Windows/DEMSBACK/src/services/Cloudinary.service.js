import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary con credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube un archivo (PDF) a Cloudinary desde un Buffer
 * @param {Buffer} fileBuffer - Buffer del archivo a subir
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {string} folder - Carpeta en Cloudinary (ej: 'menus', 'tickets')
 * @returns {Promise<{url: string, secure_url: string, publicId: string}>}
 */
export const uploadPDFToCloudinary = (fileBuffer, fileName, folder = 'dems') => {
  return new Promise((resolve, reject) => {
    // Siempre incluimos la extensión .pdf en el public_id para evitar problemas de nombre sin extensión
    const publicId = `${folder}/${fileName}.pdf`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image', // los PDF pueden tratarse como imagen para accesos fáciles en Cloudinary
        public_id: publicId,
        overwrite: true,
        format: 'pdf',
        type: 'upload',
      },
      (error, result) => {
        if (error) {
          console.error('Error al subir a Cloudinary:', error);
          reject(error);
        } else {
          // Endpoint de imagen con PDF
          const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
          const secureUrl = `${baseUrl}/${result.public_id}.pdf`;

          resolve({
            url: secureUrl,
            secure_url: secureUrl,
            publicId: result.public_id,
            previewUrl: `${baseUrl}/fl_inline/${result.public_id}.pdf`,
            downloadUrl: `${baseUrl}/fl_attachment/${result.public_id}.pdf`,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Genera URL de Cloudinary con opciones de visualización
 * @param {string} publicId - Public ID completo del archivo (ej. 'menus/menu-loma-bonita.pdf')
 * @param {string} mode - 'inline' (previsualizar) o 'attachment' (descargar)
 * @returns {string} URL completa
 */
export const getCloudinaryUrl = (publicId, mode = 'inline') => {
  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const flag = mode === 'inline' ? 'fl_inline' : mode === 'attachment' ? 'fl_attachment' : '';

  if (flag) {
    return `${baseUrl}/${flag}/${publicId}`;
  }
  return `${baseUrl}/${publicId}`;
};

export default {
  uploadPDFToCloudinary,
  getCloudinaryUrl,
};
