const express = require('express');
const cors = require('cors')
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

// ============================
// CONFIG
// ============================
const expected = parseInt(process.argv[2], 10) || 1;
const devices = new Set();
let connected = 0;

const basePath = __dirname;
const statusPath = path.join(basePath, 'status.txt');
const qrPngPath = path.join(basePath, 'qr.png'); // Solo generaremos PNG

// ============================
// OBTENER IP LOCAL
// ============================
function getLocalIP() {
  const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) return net.address;
        }
    }
    return '127.0.0.1';
}

async function generateQR(ip) {
    const url = `http://${ip}:3000/login`;
    try {
        // Generamos el PNG y terminamos. Inno Setup se encargará del resto.
        await QRCode.toFile(qrPngPath, url, { width: 300 });
        console.log("QR PNG generado exitosamente.");
    } catch (err) {
        console.error("Error generando PNG:", err);
    }
}

const ip = getLocalIP();

// Guardar IP (opcional)
fs.writeFileSync(path.join(basePath, 'ip.txt'), ip);

// ============================
// ESTADO
// ============================
function updateStatus() {
  fs.writeFileSync(statusPath, `${connected}/${expected}`);
}

// Inicializar estado
updateStatus();

// ============================
// API
// ============================
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} a ${req.url}`);
  next();
});

app.post('/register', (req, res) => {
  const id = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!devices.has(id)) {
    devices.add(id);
    connected++;
    updateStatus();
  }

  console.log(`Dispositivo conectado: ${connected}/${expected}`);

  res.status(200).json({ ok: true });

  if (connected >= expected) {
    console.log("Todos conectados ✔");
    process.exit(0);
  }
});

// ============================
// SERVIDOR + QR
// ============================
app.listen(3000, '0.0.0.0', async () => {
  console.log("=================================");
  console.log("Servidor iniciado en el puerto 3000");
  console.log("IP detectada:", ip);
  
  // Llamamos a la función que ya definiste arriba
  await generateQR(ip); 
  
  console.log("Esperando dispositivos...");
  console.log("=================================");
});