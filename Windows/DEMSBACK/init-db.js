const sql = require('mssql');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // En {app}\DEMSBACK\, el .sql queda en el mismo directorio que init-db.js
    const scriptPath = path.join(__dirname, 'SQLDEMS.sql');
    const script = fs.readFileSync(scriptPath, 'utf8');

    await sql.connect({
      user: 'sa',
      password: 'Admin123!',
      server: 'localhost\\SQLEXPRESS',
      database: 'master',
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });

    console.log("Ejecutando script SQL...");

    // mssql no puede ejecutar scripts con múltiples statements (GO) directamente.
    // Hay que dividir por GO y ejecutar cada bloque por separado.
    const batches = script
      .split(/^\s*GO\s*$/im)
      .map(b => b.trim())
      .filter(b => b.length > 0);

    for (const batch of batches) {
      await sql.query(batch);
    }

    console.log("Base de datos creada correctamente");
    process.exit(0);

  } catch (err) {
    console.error("Error BD:", err.message);
    process.exit(1);
  }
}

run();