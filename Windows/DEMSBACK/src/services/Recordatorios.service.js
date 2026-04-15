import { getConnection, sql } from '../config/connection.js';

export const getReservacionesProximas = async () => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT Correo, Fecha, NombreCliente
      FROM Reservaciones
      WHERE Fecha >= GETDATE()
    `);

    return result.recordset;

  } catch (error) {
    console.error('Error al obtener reservaciones:', error);
    throw error;
  }
};