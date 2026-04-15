import cron from 'node-cron';
import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail } from '../services/Email.service.js';

// PROGRAMAR TAREA
export const iniciarRecordatorios = async () => {
  console.log('Ejecutando envío de recordatorios...');

  try {
    const reservaciones = await getReservacionesProximas();

    for (const r of reservaciones) {
      await sendReminderEmail(
        r.Correo,
        r.Fecha,
        r.NombreCliente
      );
    }

    console.log(`Correos enviados: ${reservaciones.length}`);
  } catch (error) {
    console.error('Error al enviar recordatorios:', error);
  }
};