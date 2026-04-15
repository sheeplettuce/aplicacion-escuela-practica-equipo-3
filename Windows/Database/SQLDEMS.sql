CREATE DATABASE DEMS;
GO
USE DEMS;

-- 1. TABLAS CATALOGO
CREATE TABLE RolTrabajadores (
    idRolTrabajadores INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(15) NOT NULL
);

INSERT INTO RolTrabajadores (Nombre) VALUES 
('Administrador'),
('Mesero'),
('Cocina');

CREATE TABLE TiposPago (
    idTiposPago INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL
);

INSERT INTO TiposPago (Nombre) VALUES
('Efectivo'),
('Transferencia'),
('Tarjeta');

CREATE TABLE CategoriasPlatillos (
    idCategoriasPlatillos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(15) NOT NULL
);

INSERT INTO CategoriasPlatillos (Nombre) VALUES
('Comida'),
('Bebidas'),
('Extras');

-- 2. TABLAS PRINCIPALES
CREATE TABLE Trabajadores (
    idTrabajador INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(45) UNIQUE NOT NULL,
    Contra VARCHAR(100) NOT NULL,
    RolTrabajadores_idRolTrabajadores INT NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,

    INDEX fk_trabajadores_Rol_idx (RolTrabajadores_idRolTrabajadores),
    CONSTRAINT fk_trabajadores_Rol
        FOREIGN KEY (RolTrabajadores_idRolTrabajadores) 
        REFERENCES RolTrabajadores(idRolTrabajadores)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

INSERT INTO Trabajadores (Nombre, Contra, RolTrabajadores_idRolTrabajadores, Activo) VALUES
('Admin', '$2a$12$a8G2S1BVvQuZYjjLApPNceXsoeN6D8xiVVIVsHv0kYOHpaOxR/ca6', 1, 1);

CREATE TABLE Platillos (
    idPlatillo INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(45) NOT NULL,
    Descripcion VARCHAR(45),
    Precio DECIMAL(10,2) NOT NULL,
    CategoriasPlatillos_idCategoriasPlatillos INT NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,

    INDEX fk_platillos_Categoria_idx (CategoriasPlatillos_idCategoriasPlatillos),
    CONSTRAINT fk_platillos_Categoria
        FOREIGN KEY (CategoriasPlatillos_idCategoriasPlatillos) 
        REFERENCES CategoriasPlatillos(idCategoriasPlatillos)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Reservaciones (
    idReservacion INT PRIMARY KEY IDENTITY(1,1),
    NombreCliente VARCHAR(45) NOT NULL,
    Telefono VARCHAR(10),
    Correo VARCHAR(45),
    Fecha DATETIME NOT NULL,
    NoPersonas INT NOT NULL,
    Estado VARCHAR(45) NOT NULL,
    trabajadores_idTrabajador INT NOT NULL,

    INDEX fk_reservaciones_trabajadores_idx (trabajadores_idTrabajador),
    CONSTRAINT fk_reservaciones_trabajadores
        FOREIGN KEY (trabajadores_idTrabajador) 
        REFERENCES trabajadores(idTrabajador)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Pedidos (
    idPedido INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Estado VARCHAR(45) NOT NULL,
    Tipo TINYINT NOT NULL, 
    NoMesa INT,            
    trabajadores_idTrabajador INT NOT NULL,
    
    INDEX fk_pedidos_trabajadores_idx (trabajadores_idTrabajador),
    CONSTRAINT fk_pedidos_trabajadores
    FOREIGN KEY (trabajadores_idTrabajador) 
    REFERENCES trabajadores(idTrabajador)
    ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Pagos (
    idPago INT PRIMARY KEY IDENTITY(1,1),
    Monto DECIMAL(10,2) NOT NULL,
    Pedidos_idPedido INT NOT NULL,
    TiposPago_idTiposPago INT NOT NULL,

    INDEX fk_pagos_pedidos_idx (Pedidos_idPedido),
    CONSTRAINT fk_pagos_pedidos 
        FOREIGN KEY (Pedidos_idPedido) 
        REFERENCES pedidos(idPedido)
        ON DELETE NO ACTION ON UPDATE CASCADE,
        
    INDEX fk_pagos_TiposPago_idx (TiposPago_idTiposPago),
    CONSTRAINT fk_pagos_TiposPago 
        FOREIGN KEY (TiposPago_idTiposPago) 
        REFERENCES TiposPago(idTiposPago)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE DetallesPedido (
    idDetallePedido INT PRIMARY KEY IDENTITY(1,1),
    Pedidos_idPedido INT NOT NULL,
    Platillos_idPlatillo INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Nota VARCHAR(45),
    INDEX fk_detallesPedido_pedidos_idx (Pedidos_idPedido),
    CONSTRAINT fk_detallesPedido_pedidos 
        FOREIGN KEY (Pedidos_idPedido) 
        REFERENCES pedidos(idPedido)
        ON DELETE NO ACTION ON UPDATE CASCADE,

    INDEX fk_detallesPedido_platillos_idx (Platillos_idPlatillo),
    CONSTRAINT fk_detallesPedido_platillos
        FOREIGN KEY (Platillos_idPlatillo) 
        REFERENCES platillos(idPlatillo)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE TABLE Logs (
    idHistorial INT PRIMARY KEY IDENTITY(1,1),
    trabajadores_idTrabajador INT NOT NULL,
    TablaAfectada VARCHAR(45) NOT NULL,
    Accion VARCHAR(20) NOT NULL,
    DatosAnt VARCHAR(100),
    DatosNv VARCHAR(100),
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Descripcion VARCHAR(45),

    INDEX fk_logs_trabajadores_idx (trabajadores_idTrabajador),
    CONSTRAINT fk_logs_trabajadores
    FOREIGN KEY (trabajadores_idTrabajador) 
    REFERENCES trabajadores(idTrabajador)
    ON DELETE NO ACTION ON UPDATE CASCADE
);
GO

-- 3. PROCESOS ALMACENADOS
CREATE PROCEDURE sp_LoginTrabajador @Nombre VARCHAR(45) AS
BEGIN
    SELECT t.idTrabajador, t.Nombre, t.Contra, r.Nombre AS Rol
    FROM trabajadores t
    INNER JOIN RolTrabajadores r ON t.RolTrabajadores_idRolTrabajadores = r.idRolTrabajadores
    WHERE t.Nombre = @Nombre AND t.Activo = 1;
END;
GO

CREATE PROCEDURE sp_RegistrarPedido @TrabajadorId INT, @Tipo TINYINT, @NoMesa INT, @DetallesPedido NVARCHAR(MAX) AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO pedidos (Fecha, Estado, Tipo, NoMesa, trabajadores_idTrabajador)
        VALUES (GETDATE(), 'Proceso', @Tipo, @NoMesa, @TrabajadorId);
        DECLARE @Id INT = SCOPE_IDENTITY();
        INSERT INTO detallespedido (Pedidos_idPedido, Platillos_idPlatillo, Cantidad, PrecioUnitario, Nota)
        SELECT @Id, id, Cantidad, PrecioUnitario, Nota FROM OPENJSON(@DetallesPedido)
        WITH (id INT, Cantidad INT, PrecioUnitario DECIMAL(10,2), Nota VARCHAR(45));
        COMMIT TRANSACTION;

        SELECT @Id AS idPedido; -- Retorna el ID del pedido recién creado para que el frontend pueda usarlo
    END TRY
    BEGIN CATCH ROLLBACK TRANSACTION; THROW; END CATCH
END;
GO

CREATE PROCEDURE sp_FinalizarPedido @idPedido INT AS
BEGIN
    UPDATE pedidos SET Estado = 'Completado' WHERE idPedido = @idPedido;
END;
GO

CREATE PROCEDURE sp_ActualizarPedido @idPedido INT, @TrabajadorId INT, @Tipo TINYINT, @NoMesa INT, @DetallesPedido NVARCHAR(MAX) AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        UPDATE Pedidos
        SET Tipo = @Tipo,
            NoMesa = @NoMesa,
            trabajadores_idTrabajador = @TrabajadorId,
            Fecha = GETDATE()
        WHERE idPedido = @idPedido;

        DELETE FROM detallespedido WHERE Pedidos_idPedido = @idPedido;

        INSERT INTO detallespedido (Pedidos_idPedido, Platillos_idPlatillo, Cantidad, PrecioUnitario, Nota)
        SELECT @idPedido, id, Cantidad, PrecioUnitario, Nota FROM OPENJSON(@DetallesPedido)
        WITH (id INT, Cantidad INT, PrecioUnitario DECIMAL(10,2), Nota VARCHAR(45));
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH ROLLBACK TRANSACTION; THROW; END CATCH
END;
GO

CREATE PROCEDURE sp_CrearTrabajador @Nom VARCHAR(45), @Con VARCHAR(100), @Rol INT AS
BEGIN
    INSERT INTO trabajadores (Nombre, Contra, RolTrabajadores_idRolTrabajadores) VALUES (@Nom, @Con, @Rol);
END;
GO
--procedimiento para obtener los platillos con su categoria en formato JSON
CREATE PROCEDURE sp_GetPlatillosEstructura
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.idPlatillo,
        p.Nombre,
        p.Precio,
        (SELECT 
            c.idCategoriasPlatillos AS id, 
            c.Nombre AS nombre 
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Categoria,
        p.Activo
    FROM platillos p
    INNER JOIN CategoriasPlatillos c ON p.CategoriasPlatillos_idCategoriasPlatillos = c.idCategoriasPlatillos
    FOR JSON PATH; -- Esto convierte todo el resultado en un arreglo de objetos JSON
END;
GO

--Procedimiento para obtener los trabajadores con su rol en formato JSON
CREATE PROCEDURE sp_GetTrabajadoresEstructura
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        t.idTrabajador,
        t.Nombre,
        t.Activo,
        (SELECT 
            r.idRolTrabajadores AS id, 
            r.Nombre AS nombre 
         FROM RolTrabajadores r 
         WHERE r.idRolTrabajadores = t.RolTrabajadores_idRolTrabajadores
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Rol
    FROM trabajadores t
    FOR JSON PATH;
END;
GO

--Procedimiento para obtener los pedidos con su mesero en formato JSON
CREATE PROCEDURE sp_GetPedidosEstructura
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.idPedido,
        p.Fecha,
        p.Estado,
        p.NoMesa,
        p.Tipo, -- 1: Local, 0: Llevar
        -- Información del mesero
        (SELECT 
            t.idTrabajador AS id, 
            t.Nombre AS nombre 
         FROM trabajadores t 
         WHERE t.idTrabajador = p.trabajadores_idTrabajador
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Mesero,
        -- Lista de platillos del pedido
        (SELECT 
            dp.Platillos_idPlatillo AS id, 
            pl.Nombre AS nombre,
            dp.Cantidad,
            dp.PrecioUnitario,
            dp.Nota
         FROM DetallesPedido dp
            JOIN Platillos pl ON pl.idPlatillo = dp.Platillos_idPlatillo
            WHERE dp.Pedidos_idPedido = p.idPedido
            FOR JSON PATH) AS Platillos
    FROM pedidos p
    ORDER BY p.Fecha DESC
    FOR JSON PATH;
END
GO

--Para obtener los datos para mostrar el detalle de un pedido, incluyendo el platillo con su categoria en formato JSON
CREATE PROCEDURE sp_GetDetallesPedidoEstructura
    @idPedido INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        dp.idDetallePedido,
        dp.Cantidad,
        dp.PrecioUnitario,
        dp.Nota,
        (SELECT 
            pl.idPlatillo AS id, 
            pl.Nombre AS nombre ,
            pl.Descripcion,
            pl.Precio
         FROM platillos pl 
         WHERE pl.idPlatillo = dp.Platillos_idPlatillo
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Platillo
    FROM detallespedido dp
    WHERE dp.Pedidos_idPedido = @idPedido
    FOR JSON PATH;
END;
GO

--Procedimiento para obtener los pagos con su metodo de pago en formato JSON
CREATE PROCEDURE sp_GetPagosEstructura
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        pg.idPago,
        pg.Monto,
        pg.Pedidos_idPedido AS idPedido,
        (SELECT 
            tp.idTiposPago AS id, 
            tp.Nombre AS nombre 
         FROM TiposPago tp 
         WHERE tp.idTiposPago = pg.TiposPago_idTiposPago
         FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS MetodoPago
    FROM pagos pg
    FOR JSON PATH;
END;
GO

--Procedimiento para el abisa 
CREATE PROCEDURE sp_GetReservacionesProximas
AS
BEGIN
    SET NOCOUNT ON;

    -- Definimos el rango de búsqueda: desde hoy hasta 3 días después
    DECLARE @FechaInicio DATE = CAST(GETDATE() AS DATE);
    DECLARE @FechaFin DATE = DATEADD(DAY, 4, @FechaInicio);

    BEGIN TRY
        SELECT 
            r.idReservacion,
            r.NombreCliente,
            r.Telefono,
            r.Correo,
            r.Fecha,
            r.NoPersonas,
            r.Estado,
            -- Estructura de objeto anidado para el Trabajador que registró
            (SELECT 
                t.idTrabajador AS id, 
                t.Nombre AS nombre 
             FROM trabajadores t 
             WHERE t.idTrabajador = r.trabajadores_idTrabajador
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS RegistradoPor
        FROM reservaciones r
        WHERE CAST(r.Fecha AS DATE) BETWEEN @FechaInicio AND @FechaFin
          AND r.Estado <> 'Cancelada' -- Opcional: No mostrar las ya canceladas
        ORDER BY r.Fecha ASC
        FOR JSON PATH; -- Retorna el arreglo de objetos para el Frontend
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

--Procedimientos para las graficas 
--ventas totales por dia en un rango de fechas, con formato JSON para el frontend
CREATE PROCEDURE sp_GraficaVentasPorFecha
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        CAST(p.Fecha AS DATE) AS fecha,
        SUM(pg.Monto) AS totalVentas
    FROM pagos pg
    INNER JOIN pedidos p ON pg.Pedidos_idPedido = p.idPedido
    WHERE p.Fecha BETWEEN @FechaInicio AND @FechaFin
    GROUP BY CAST(p.Fecha AS DATE)
    ORDER BY fecha ASC
    FOR JSON PATH;
END;
GO
--Ventas por metodo de pago 
CREATE PROCEDURE sp_GraficaMetodosPago
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        tp.Nombre AS metodo,
        SUM(pg.Monto) AS total
    FROM pagos pg
    INNER JOIN TiposPago tp ON pg.TiposPago_idTiposPago = tp.idTiposPago
    INNER JOIN pedidos p ON pg.Pedidos_idPedido = p.idPedido
    WHERE p.Fecha BETWEEN @FechaInicio AND @FechaFin
    GROUP BY tp.Nombre
    FOR JSON PATH;
END;
GO
--Historial de ventas por platillo
CREATE PROCEDURE sp_ReporteHistorialVentas
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        p.idPedido,
        p.Fecha,
        pg.Monto AS total,
        tp.Nombre AS metodo,
        (SELECT t.Nombre FROM trabajadores t WHERE t.idTrabajador = p.trabajadores_idTrabajador) AS mesero
    FROM pedidos p
    INNER JOIN pagos pg ON p.idPedido = pg.Pedidos_idPedido
    INNER JOIN TiposPago tp ON pg.TiposPago_idTiposPago = tp.idTiposPago
    WHERE p.Fecha BETWEEN @FechaInicio AND @FechaFin
    ORDER BY p.Fecha DESC
    FOR JSON PATH;
END;
GO

--productos mas vendidos
CREATE PROCEDURE sp_GraficaTopPlatillos
    @FechaInicio DATETIME,
    @FechaFin DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TOP 10
        pl.Nombre AS platillo,
        SUM(dp.Cantidad) AS cantidadVendida
    FROM detallespedido dp
    INNER JOIN platillos pl ON dp.Platillos_idPlatillo = pl.idPlatillo
    INNER JOIN pedidos p ON dp.Pedidos_idPedido = p.idPedido
    WHERE p.Fecha BETWEEN @FechaInicio AND @FechaFin
    GROUP BY pl.Nombre
    ORDER BY cantidadVendida DESC
    FOR JSON PATH;
END;
GO

--PROCEDIMIENTOS PARA EL CRUD DE TRABAJADORES

--Procedimiento de lsitar trabajadores
CREATE PROCEDURE sp_GetAllTrabajadores
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.idTrabajador,
            t.Nombre,
            t.Activo,
            (SELECT 
                r.idRolTrabajadores AS id, 
                r.Nombre AS nombre 
             FROM RolTrabajadores r 
             WHERE r.idRolTrabajadores = t.RolTrabajadores_idRolTrabajadores
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Rol
        FROM trabajadores t
        WHERE t.Activo = 1 -- Solo los que no han sido "eliminados"
        FOR JSON PATH;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--Procedimeinto para obtenr un trabajador por su id
CREATE PROCEDURE sp_GetTrabajadorById
    @idTrabajador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            t.idTrabajador,
            t.Nombre,
            t.RolTrabajadores_idRolTrabajadores AS idRol,
            t.Activo
        FROM trabajadores t
        WHERE t.idTrabajador = @idTrabajador
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--Procedimiento para actualizar un trabajador
CREATE PROCEDURE sp_UpdateTrabajador
    @idTrabajador INT,
    @Nombre VARCHAR(45),
    @Contra VARCHAR(100), -- Hash enviado desde Node.js
    @idRol INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE trabajadores
            SET Nombre = @Nombre,
                Contra = ISNULL(@Contra, Contra), -- Si mandas NULL no cambia la contraseña actual
                RolTrabajadores_idRolTrabajadores = @idRol
            WHERE idTrabajador = @idTrabajador;

            IF @@ROWCOUNT = 0
                RAISERROR('El trabajador no existe.', 16, 1);

            SELECT 'Trabajador actualizado con éxito' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

--procedimiento para eliminar un trabajador (marcar como inactivo)
CREATE PROCEDURE sp_DeleteTrabajador
    @idTrabajador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE trabajadores
            SET Activo = 0
            WHERE idTrabajador = @idTrabajador;

            IF @@ROWCOUNT = 0
                RAISERROR('No se pudo encontrar al trabajador.', 16, 1);

            SELECT 'Trabajador desactivado correctamente' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
--PROCEDIMENTOS PARA EL CRUD DE PLATILLOS
--Procedimiento para listar platillos
CREATE PROCEDURE sp_GetAllPlatillos
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPlatillo,
            p.Nombre,
            p.Descripcion,
            p.Precio,
            p.Activo,
            -- Estructura de objeto para la Categoría
            (SELECT 
                c.idCategoriasPlatillos AS id, 
                c.Nombre AS nombre 
             FROM CategoriasPlatillos c 
             WHERE c.idCategoriasPlatillos = p.CategoriasPlatillos_idCategoriasPlatillos
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Categoria
        FROM platillos p
        WHERE p.Activo = 1 -- Solo mostrar platillos vigentes en el menú
        FOR JSON PATH;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
--Procedimiento para obtener un platillo por su id
CREATE PROCEDURE sp_GetPlatilloById
    @idPlatillo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPlatillo,
            p.Nombre,
            p.Descripcion,
            p.Precio,
            p.CategoriasPlatillos_idCategoriasPlatillos AS idCategoria,
            p.Activo
        FROM platillos p
        WHERE p.idPlatillo = @idPlatillo
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
--Procedimiento para actualizar un platillo
CREATE PROCEDURE sp_UpdatePlatillo
    @idPlatillo INT,
    @Nombre VARCHAR(45),
    @Descripcion VARCHAR(45),
    @Precio DECIMAL(10,2),
    @idCategoria INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE platillos
            SET Nombre = @Nombre,
                Descripcion = @Descripcion,
                Precio = @Precio,
                CategoriasPlatillos_idCategoriasPlatillos = @idCategoria
            WHERE idPlatillo = @idPlatillo;

            IF @@ROWCOUNT = 0
                RAISERROR('El platillo especificado no existe.', 16, 1);

            SELECT 'Platillo actualizado correctamente' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
--Procedimiento para eliminar un platillo 
CREATE PROCEDURE sp_DeletePlatillo
    @idPlatillo INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE platillos
            SET Activo = 0
            WHERE idPlatillo = @idPlatillo;

            IF @@ROWCOUNT = 0
                RAISERROR('No se encontró el platillo para desactivar.', 16, 1);

            SELECT 'Platillo retirado del menú (Desactivado)' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

--Procedimientos almacenados para el crud de pagos 
--Procedimiento para registrar un pago
CREATE PROCEDURE sp_InsertarPago
    @Monto DECIMAL(10,2),
    @idPedido INT,
    @idTipoPago INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- Validar que el pedido no esté ya pagado o terminado
            IF EXISTS (SELECT 1 FROM pedidos WHERE idPedido = @idPedido AND Estado = 'Terminado')
            BEGIN
                RAISERROR('Este pedido ya ha sido finalizado o pagado anteriormente.', 16, 1);
            END

            INSERT INTO pagos (Monto, Pedidos_idPedido, TiposPago_idTiposPago)
            VALUES (@Monto, @idPedido, @idTipoPago);

            SELECT 'Pago registrado y pedido finalizado con éxito' AS Mensaje, SCOPE_IDENTITY() AS idPago;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

--Procedimiento para listar todos los pagos 
CREATE PROCEDURE sp_GetAllPagos
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPago,
            p.Monto,
            p.Pedidos_idPedido AS idPedido,
            (SELECT 
                tp.idTiposPago AS id, 
                tp.Nombre AS nombre 
             FROM TiposPago tp 
             WHERE tp.idTiposPago = p.TiposPago_idTiposPago
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS MetodoPago
        FROM pagos p
        ORDER BY p.idPago DESC
        FOR JSON PATH;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--Procedimiento para obtener un pago por su id 
CREATE PROCEDURE sp_GetPagoByPedido
    @idPedido INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPago,
            p.Monto,
            tp.Nombre AS MetodoPago
        FROM pagos p
        INNER JOIN TiposPago tp ON p.TiposPago_idTiposPago = tp.idTiposPago
        WHERE p.Pedidos_idPedido = @idPedido
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--Procedimeinto para corregir un pago(update)
CREATE PROCEDURE sp_UpdatePago
    @idPago INT,
    @Monto DECIMAL(10,2),
    @idTipoPago INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            UPDATE pagos
            SET Monto = @Monto,
                TiposPago_idTiposPago = @idTipoPago
            WHERE idPago = @idPago;

            IF @@ROWCOUNT = 0
                RAISERROR('No se encontró el registro de pago.', 16, 1);

            SELECT 'Información de pago actualizada' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

--Procedimiento para eliminar un pago (marcar como error o corregirlo)
CREATE PROCEDURE sp_AnularPago
    @idPago INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            DECLARE @idPedido INT;
            SELECT @idPedido = Pedidos_idPedido FROM pagos WHERE idPago = @idPago;

            -- 1. Regresar el pedido a estado 'Proceso'
            UPDATE pedidos SET Estado = 'Proceso' WHERE idPedido = @idPedido;

            -- 2. Eliminar el registro del pago
            DELETE FROM pagos WHERE idPago = @idPago;

            IF @@ROWCOUNT = 0
                RAISERROR('No se pudo anular el pago.', 16, 1);

            SELECT 'Pago anulado y pedido reabierto' AS Mensaje;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

--PROCEDIMIENTO PARA OBTNER LOS PAGOS POR PEDIDO
CREATE PROCEDURE sp_GetPagosPorPedido
    @idPedido INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Verificamos si el pedido tiene pagos asociados
        IF NOT EXISTS (SELECT 1 FROM pagos WHERE Pedidos_idPedido = @idPedido)
        BEGIN
            SELECT '[]' AS Resultado; -- Retorna un arreglo vacío si no hay pagos
            RETURN;
        END

        SELECT 
            pg.idPago,
            pg.Monto,
            (SELECT 
                tp.idTiposPago AS id, 
                tp.Nombre AS nombre 
             FROM TiposPago tp 
             WHERE tp.idTiposPago = pg.TiposPago_idTiposPago
             FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS MetodoPago,
            p.Fecha AS FechaTransaccion
        FROM pagos pg
        INNER JOIN pedidos p ON pg.Pedidos_idPedido = p.idPedido
        WHERE pg.Pedidos_idPedido = @idPedido
        FOR JSON PATH;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
--
-- 4. TRIGGERS 
--Trigger que acci n de inserci n o modificaci n en la tabla de platillos
CREATE TRIGGER trg_LogPlatillos
ON platillos
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @Accion VARCHAR(20);
    SET @Accion = CASE 
        WHEN EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted) THEN 'UPDATE'
        WHEN EXISTS(SELECT * FROM inserted) THEN 'INSERT'
        ELSE 'DELETE'
    END;

    INSERT INTO Logs (trabajadores_idTrabajador, TablaAfectada, Accion, DatosAnt, DatosNv, Fecha, Descripcion)
    SELECT 
        (SELECT TOP 1 idTrabajador FROM trabajadores WHERE RolTrabajadores_idRolTrabajadores = 1), -- Referencia a Admin
        'platillos',
        @Accion,
        (SELECT Nombre FROM deleted),
        (SELECT Nombre FROM inserted),
        GETDATE(),
        'Movimiento autom tico en cat logo de men '
    FROM inserted;
END;
GO

--Trigger que acci n de inserci n o modificaci n en la tabla de trabajadores
CREATE TRIGGER trg_LogTrabajadores
ON trabajadores
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion VARCHAR(20) = 
        CASE 
            WHEN EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted) THEN 'UPDATE'
            WHEN EXISTS(SELECT * FROM inserted) THEN 'INSERT'
            ELSE 'DELETE'
        END;

    INSERT INTO Logs (trabajadores_idTrabajador, TablaAfectada, Accion, DatosAnt, DatosNv, Fecha, Descripcion)
    SELECT 
        ISNULL((SELECT TOP 1 idTrabajador FROM trabajadores WHERE RolTrabajadores_idRolTrabajadores = 1), 1),
        'trabajadores',
        @Accion,
        (SELECT Nombre FROM deleted),
        (SELECT Nombre FROM inserted),
        GETDATE(),
        'Gesti n de personal/usuarios'
    FROM inserted;
END;
GO

--Trigger que acci n de inserci n o modificaci n en la tabla de pedidos
CREATE TRIGGER trg_LogPedidos
ON pedidos
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accion VARCHAR(20) = 
        CASE 
            WHEN EXISTS(SELECT * FROM deleted) THEN 'UPDATE'
            ELSE 'INSERT'
        END;

    INSERT INTO Logs (trabajadores_idTrabajador, TablaAfectada, Accion, DatosAnt, DatosNv, Fecha, Descripcion)
    SELECT 
        i.trabajadores_idTrabajador,
        'pedidos',
        @Accion,
        (SELECT Estado FROM deleted),
        i.Estado,
        GETDATE(),
        CONCAT('Pedido No. ', i.idPedido, ' - Mesa: ', i.NoMesa)
    FROM inserted i;
END;
GO

--Trigger que acci n de inserci n o modificaci n en la tabla de pagos
CREATE TRIGGER trg_LogPagos
ON pagos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Logs (trabajadores_idTrabajador, TablaAfectada, Accion, DatosAnt, DatosNv, Fecha, Descripcion)
    SELECT 
        (SELECT trabajadores_idTrabajador FROM pedidos WHERE idPedido = i.Pedidos_idPedido),
        'pagos',
        'INSERT',
        NULL,
        CAST(i.Monto AS VARCHAR),
        GETDATE(),
        CONCAT('Pago registrado para el pedido ID: ', i.Pedidos_idPedido)
    FROM inserted i;
END;
GO


--Trigger de validacion de Reservaciones 
CREATE TRIGGER trg_EstadoReservacion
ON reservaciones
AFTER INSERT
AS
BEGIN
    -- Asegura que las reservaciones nuevas entren en estado 'Proceso' por defecto
    UPDATE r
    SET Estado = 'Proceso'
    FROM reservaciones r
    INNER JOIN inserted i ON r.idReservacion = i.idReservacion
    WHERE i.Estado IS NULL OR i.Estado = '';
END;
GO

--Trigger para finalizar el pedido automáticamente al registrar un pago, actualizando su estado a 'Terminado'
CREATE TRIGGER trg_FinalizarPedidoTrasPago
ON pagos
AFTER INSERT
AS
BEGIN
    -- SET NOCOUNT ON impide que se envíen mensajes de 'filas afectadas' para ahorrar ancho de banda
    SET NOCOUNT ON;

    BEGIN TRY
        -- Actualizamos la tabla pedidos basándonos en el Pedidos_idPedido del pago recién insertado
        UPDATE p
        SET p.Estado = 'Terminado'
        FROM pedidos p
        INNER JOIN inserted i ON p.idPedido = i.Pedidos_idPedido
        WHERE p.Estado <> 'Terminado'; -- Solo actualizamos si no estaba terminado ya

        -- Nota: El trigger de Logs que ya tenemos (trg_LogPedidos) se disparará 
        -- automáticamente al ocurrir este UPDATE, registrando el movimiento.
        
    END TRY
    BEGIN CATCH
        -- En caso de error, lanzamos una alerta
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
-- 5. SEGURIDAD (AL FINAL)
USE master; 
GO
CREATE LOGIN admin_login WITH PASSWORD = 'Admin123!';
CREATE LOGIN mesero_login WITH PASSWORD = 'Mesero123!';
CREATE LOGIN cocina_login WITH PASSWORD = 'Cocina123!';
GO

USE DEMS; 
GO
CREATE USER admin_user FOR LOGIN admin_login;
CREATE USER mesero_user FOR LOGIN mesero_login;
CREATE USER cocina_user FOR LOGIN cocina_login;
GO

CREATE ROLE rol_admin; GRANT CONTROL TO rol_admin;
CREATE ROLE rol_mesero;
GRANT SELECT ON Platillos TO rol_mesero;
GRANT SELECT, INSERT, UPDATE ON pedidos TO rol_mesero;
GRANT SELECT, INSERT ON detallespedido TO rol_mesero;
GRANT SELECT, INSERT ON pagos TO rol_mesero;
DENY SELECT ON trabajadores(Contra) TO rol_mesero;

CREATE ROLE rol_cocina;
GRANT SELECT ON pedidos TO rol_cocina;
GRANT SELECT ON detallespedido TO rol_cocina;
GRANT EXECUTE ON sp_FinalizarPedido TO rol_cocina;

ALTER ROLE rol_admin ADD MEMBER admin_user;
ALTER ROLE rol_mesero ADD MEMBER mesero_user;
ALTER ROLE rol_cocina ADD MEMBER cocina_user;

GRANT EXECUTE ON sp_LoginTrabajador TO rol_mesero, rol_cocina, rol_admin;
GRANT EXECUTE ON sp_RegistrarPedido TO rol_mesero, rol_admin;
GRANT EXECUTE ON sp_CrearTrabajador TO rol_admin;
GO

--VISTAS
--Vista de platillos 
CREATE VIEW vw_MenuDetallado AS
SELECT 
    p.idPlatillo,
    p.Nombre AS Platillo,
    p.Precio,
    c.Nombre AS Categoria,
    p.Activo
FROM platillos p
INNER JOIN CategoriasPlatillos c ON p.CategoriasPlatillos_idCategoriasPlatillos = c.idCategoriasPlatillos;


