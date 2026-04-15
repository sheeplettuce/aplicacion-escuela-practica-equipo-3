import { uploadPDFToCloudinary } from './src/services/Cloudinary.service.js';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';

dotenv.config();

// Test: generar un PDF simple y subirlo a Cloudinary
const testCloudinaryUpload = async () => {
    console.log('🧪 Iniciando prueba de Cloudinary...\n');
    
    try {
        // 1. Crear un PDF de prueba
        console.log('📄 Generando PDF de prueba...');
        const pdfBuffer = await new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.fontSize(25).text('Prueba de Cloudinary', 100, 100);
            doc.fontSize(12)
               .text('Este es un PDF de prueba para verificar la integración', 100, 150)
               .text(`Fecha: ${new Date().toLocaleString()}`, 100, 180)
               .text('✅ Si ves este mensaje, la integración funciona correctamente', 100, 210);

            doc.end();
        });

        console.log(`✅ PDF generado (${pdfBuffer.length} bytes)\n`);

        // 2. Subir a Cloudinary
        console.log('📤 Subiendo a Cloudinary...');
        const result = await uploadPDFToCloudinary(pdfBuffer, `test-${Date.now()}`, 'test');
        console.log('✅ ¡Subida exitosa!\n');

        // 3. Mostrar resultados
        console.log('📋 URLs generadas:');
        console.log('─'.repeat(70));
        console.log('URL base:');
        console.log(`  ${result.url}\n`);
        console.log('URL para previsualizar (Ver PDF):');
        console.log(`  ${result.previewUrl}\n`);
        console.log('URL para descargar:');
        console.log(`  ${result.downloadUrl}\n`);
        console.log('─'.repeat(70));
        console.log(`\n🆔 Public ID: ${result.publicId}`);
        console.log('\n✅ Prueba completada. Las URLs deberían ser accesibles.');
        
        // Instrucciones
        console.log('\n📌 Próximos pasos:');
        console.log('1. Copia la URL de previsualización en tu navegador');
        console.log('2. Intenta ver el PDF');
        console.log('3. Si ves error 401, revisa las credenciales en .env');
        console.log('4. Verifica que tu cuenta de Cloudinary tenga plan activo');

    } catch (error) {
        console.error('\n❌ Error durante la prueba:');
        console.error(error.message);
        if (error.http_code) {
            console.error(`Código HTTP: ${error.http_code}`);
        }
        process.exit(1);
    }
};

// Ejecutar prueba
testCloudinaryUpload().catch(console.error);
