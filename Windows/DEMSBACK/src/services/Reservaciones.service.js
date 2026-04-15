import { getConnection, sql } from '../config/connection.js';

// GET todas las reservaciones
const getReservaciones = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT idReservacion, NombreCliente, Telefono, Correo,
                   Fecha, NoPersonas, Estado, trabajadores_idTrabajador
            FROM Reservaciones
            ORDER BY Fecha ASC
        `);
    return result.recordset;
};

// GET reservaciones próximas (próximos 3 días) — sp_GetReservacionesProximas
const getReservacionesProximas = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .execute('sp_GetReservacionesProximas');
    console.log("Reservaciones recibida: ", result.recordset);
    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    console.log("Raw data: ", JSON.parse(raw));
    return JSON.parse(raw);
};

// GET reservacion por ID
const getReservacionById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT idReservacion, NombreCliente, Telefono, Correo,
                   Fecha, NoPersonas, Estado, trabajadores_idTrabajador
            FROM Reservaciones
            WHERE idReservacion = @id
        `);
    return result.recordset[0] || null;
};

// INSERT — el trigger trg_EstadoReservacion pone Estado = 'Proceso' automáticamente
const createReservacion = async ({ NombreCliente, Telefono, Correo, Fecha, NoPersonas, idTrabajador }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('NombreCliente', NombreCliente)
        .input('Telefono',      Telefono || null)
        .input('Correo',        Correo || null)
        .input('Fecha',         Fecha)
        .input('NoPersonas',    NoPersonas)
        .input('idTrabajador',  idTrabajador)
        .query(`
            INSERT INTO Reservaciones (NombreCliente, Telefono, Correo, Fecha, NoPersonas, Estado, trabajadores_idTrabajador)
            VALUES (@NombreCliente, @Telefono, @Correo, @Fecha, @NoPersonas, 'Proceso', @idTrabajador);

            SELECT SCOPE_IDENTITY() AS idReservacion;
        `);
    return result.recordset[0].idReservacion;
};

// UPDATE
const updateReservacion = async (id, { NombreCliente, Telefono, Correo, Fecha, NoPersonas, Estado }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id',            sql.Int,         id)
        .input('NombreCliente', sql.VarChar(45), NombreCliente)
        .input('Telefono',      sql.VarChar(10), Telefono || null)
        .input('Correo',        sql.VarChar(45), Correo || null)
        .input('Fecha',         sql.DateTime,    new Date(Fecha))
        .input('NoPersonas',    sql.Int,         NoPersonas)
        .input('Estado',        sql.VarChar(45), Estado)
        .query(`
            UPDATE Reservaciones
            SET NombreCliente = @NombreCliente,
                Telefono      = @Telefono,
                Correo        = @Correo,
                Fecha         = @Fecha,
                NoPersonas    = @NoPersonas,
                Estado        = @Estado
            WHERE idReservacion = @id
        `);
    return result.rowsAffected[0] > 0;
};

// DELETE
const deleteReservacion = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM Reservaciones WHERE idReservacion = @id`);
    return result.rowsAffected[0] > 0;
};

export default {
    getReservaciones,
    getReservacionesProximas,
    getReservacionById,
    createReservacion,
    updateReservacion,
    deleteReservacion
};