import { getConnection, sql } from '../config/connection.js';

const parseJsonResult = (result) => {
    const recordset = (result.recordsets && result.recordsets[0]) || result.recordset || [];
    if (!recordset || recordset.length === 0) return [];

    const key = Object.keys(recordset[0])[0];
    const jsonString = recordset.map(row => row[key]).join('');

    if (!jsonString || jsonString.trim() === '') return [];

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('❌ JSON inválido recibido del SP:', jsonString);
        return [];
    }
};

const getHistorialVentas = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_ReporteHistorialVentas');
    return parseJsonResult(result);
};

const getTopPlatillos = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaTopPlatillos');
    return parseJsonResult(result);
};

const getMetodosPago = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaMetodosPago');
    return parseJsonResult(result);
};

const getVentasPorFecha = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaVentasPorFecha');
    return parseJsonResult(result);
};

const getHistorialCambios = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT 
                l.idHistorial,
                l.TablaAfectada,
                l.Accion,
                l.DatosAnt,
                l.DatosNv,
                l.Fecha,
                l.Descripcion,
                t.Nombre AS trabajador
            FROM Logs l
            INNER JOIN trabajadores t ON l.trabajadores_idTrabajador = t.idTrabajador
            ORDER BY l.Fecha DESC
        `);
    return result.recordset;
};

export default {
    getHistorialVentas,
    getTopPlatillos,
    getMetodosPago,
    getVentasPorFecha,
    getHistorialCambios
};