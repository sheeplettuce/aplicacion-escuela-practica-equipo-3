import PDFDocument from 'pdfkit';
import svc from './Platillos.service.js';
import { uploadPDFToCloudinary } from './Cloudinary.service.js';

const COLORS = {
    black:    '#1A1A1A',
    gray:     '#888888',
    border:   '#D6C5B0',
    block:    '#C4AD95',
    blockText:'#2C2118',
    price:    '#5C3D1E',
    white:    '#FFFFFF',
    divider:  '#B89E88',
    frame:    '#8B6F47',
    frameLight: '#C4A882',
};

const MARGIN = 38;
const RADIUS = 14;

// ── MARCO DECORATIVO ────────────────────────────────────
const drawFrame = (doc, W, H) => {
    const o = 14; // offset desde el borde

    // Marco exterior grueso
    doc.rect(o, o, W - o * 2, H - o * 2)
       .lineWidth(2.5)
       .stroke(COLORS.frame);

    // Marco interior fino
    doc.rect(o + 7, o + 7, W - (o + 7) * 2, H - (o + 7) * 2)
       .lineWidth(0.8)
       .stroke(COLORS.frameLight);

    // ── Esquinas decorativas ──
    const corners = [
        [o, o],                        // top-left
        [W - o, o],                    // top-right
        [o, H - o],                    // bottom-left
        [W - o, H - o],                // bottom-right
    ];

    const armLen = 22;

    corners.forEach(([cx, cy]) => {
        const sx = cx === o ? 1 : -1;
        const sy = cy === o ? 1 : -1;

        // Cruz en la esquina
        doc.moveTo(cx, cy + sy * 6).lineTo(cx, cy + sy * armLen)
           .lineWidth(2.5).stroke(COLORS.frame);
        doc.moveTo(cx + sx * 6, cy).lineTo(cx + sx * armLen, cy)
           .lineWidth(2.5).stroke(COLORS.frame);

        // Punto central de la esquina
        doc.circle(cx, cy, 3).fill(COLORS.frame);

        // Rombo pequeño en la esquina
        const rd = 5;
        doc.moveTo(cx + sx * (armLen + rd), cy)
           .lineTo(cx + sx * (armLen + rd * 2), cy - rd * 0.6)
           .lineTo(cx + sx * (armLen + rd * 3), cy)
           .lineTo(cx + sx * (armLen + rd * 2), cy + rd * 0.6)
           .closePath()
           .fill(COLORS.frameLight);
    });

    // ── Ornamentos centrales en los 4 lados ──
    const centerOrnaments = [
        { x: W / 2, y: o,     rot: 0   },  // top
        { x: W / 2, y: H - o, rot: 0   },  // bottom
        { x: o,     y: H / 2, rot: 90  },  // left
        { x: W - o, y: H / 2, rot: 90  },  // right
    ];

    centerOrnaments.forEach(({ x, y }) => {
        // Líneas laterales
        doc.moveTo(x - 28, y).lineTo(x - 10, y).lineWidth(1).stroke(COLORS.frame);
        doc.moveTo(x + 10, y).lineTo(x + 28, y).lineWidth(1).stroke(COLORS.frame);
        // Rombo central
        doc.moveTo(x, y - 5)
           .lineTo(x + 5, y)
           .lineTo(x, y + 5)
           .lineTo(x - 5, y)
           .closePath()
           .fill(COLORS.frame);
        // Puntos laterales
        doc.circle(x - 10, y, 1.5).fill(COLORS.frameLight);
        doc.circle(x + 10, y, 1.5).fill(COLORS.frameLight);
    });

    // ── Líneas decorativas a lo largo de los bordes (punteado elegante) ──
    const dashOpts = [4, 6];
    // Top & Bottom
    for (const fy of [o + 4, H - o - 4]) {
        doc.moveTo(o + 30, fy).lineTo(W - o - 30, fy)
           .lineWidth(0.5)
           .dash(dashOpts[0], { space: dashOpts[1] })
           .stroke(COLORS.frameLight);
        doc.undash();
    }
    // Left & Right
    for (const fx of [o + 4, W - o - 4]) {
        doc.moveTo(fx, o + 30).lineTo(fx, H - o - 30)
           .lineWidth(0.5)
           .dash(dashOpts[0], { space: dashOpts[1] })
           .stroke(COLORS.frameLight);
        doc.undash();
    }
};

// ── FLORITURA BAJO EL HEADER ─────────────────────────────
const drawHeaderOrnament = (doc, W, y) => {
    const cx = W / 2;

    // Línea izquierda
    doc.moveTo(cx - 90, y).lineTo(cx - 18, y).lineWidth(0.8).stroke(COLORS.border);
    // Línea derecha
    doc.moveTo(cx + 18, y).lineTo(cx + 90, y).lineWidth(0.8).stroke(COLORS.border);

    // Rombo central
    doc.moveTo(cx, y - 5).lineTo(cx + 6, y).lineTo(cx, y + 5).lineTo(cx - 6, y)
       .closePath().fill(COLORS.frame);

    // Rombos pequeños laterales
    for (const dx of [-14, 14]) {
        doc.moveTo(cx + dx, y - 3).lineTo(cx + dx + 3, y)
           .lineTo(cx + dx, y + 3).lineTo(cx + dx - 3, y)
           .closePath().fill(COLORS.frameLight);
    }

    // Círculos en los extremos
    doc.circle(cx - 90, y, 1.5).fill(COLORS.frameLight);
    doc.circle(cx + 90, y, 1.5).fill(COLORS.frameLight);
};

// ── HEADER ──────────────────────────────────────────────
const drawHeader = (doc, W) => {
    doc.font('Times-Bold')
       .fontSize(38)
       .fillColor(COLORS.black)
       .text('Loma Bonita', 0, 52, { align: 'center', width: W });

    doc.font('Helvetica')
       .fontSize(9)
       .fillColor(COLORS.gray)
       .text('C E N A D U R Í A', 0, 100, { align: 'center', width: W });

    drawHeaderOrnament(doc, W, 118);
};

// ── BLOQUE ───────────────────────────────────────────────
const drawBlock = (doc, titulo, items, x, y, w, h) => {
    doc.roundedRect(x, y, w, h, RADIUS).fill(COLORS.block);

    doc.font('Times-Bold')
       .fontSize(17)
       .fillColor(COLORS.blockText)
       .text(titulo, x + 16, y + 16, { width: w - 32 });

    doc.rect(x + 16, y + 38, w - 32, 0.6).fill(COLORS.divider);

    let itemY = y + 48;
    const itemH = 28;

    if (items.length === 0) {
        doc.font('Helvetica')
           .fontSize(9)
           .fillColor(COLORS.divider)
           .text('Próximamente…', x + 16, itemY, { width: w - 32 });
    } else {
        for (const p of items) {
            if (itemY + itemH > y + h - 12) break;

            const nombre = p.Platillo || p.Nombre || '';
            const precio = `$${parseFloat(p.Precio).toFixed(2)}`;

            doc.font('Helvetica')
               .fontSize(10)
               .fillColor(COLORS.blockText)
               .text(nombre, x + 16, itemY + 2, {
                   width: w - 90, ellipsis: true, lineBreak: false
               });

            const nameWidth = doc.widthOfString(nombre.length > 22 ? nombre.slice(0,22)+'…' : nombre);
            const dotsX = x + 16 + nameWidth + 4;
            const dotsW = w - 90 - nameWidth - 8;
            if (dotsW > 0) {
                doc.font('Helvetica').fontSize(10).fillColor(COLORS.divider)
                   .text('·'.repeat(Math.floor(dotsW / 4.5)), dotsX, itemY + 2, {
                       width: dotsW, lineBreak: false
                   });
            }

            doc.font('Helvetica-Bold')
               .fontSize(10)
               .fillColor(COLORS.price)
               .text(precio, x + 16, itemY + 2, {
                   width: w - 32, align: 'right', lineBreak: false
               });

            if (p.Descripcion) {
                doc.font('Helvetica').fontSize(7.5).fillColor(COLORS.divider)
                   .text(p.Descripcion, x + 16, itemY + 13, {
                       width: w - 90, ellipsis: true, lineBreak: false
                   });
            }

            itemY += itemH;
        }
    }
};

// ── FOOTER ───────────────────────────────────────────────
const drawFooter = (doc, W, H) => {
    // Ornamento sobre el footer
    drawHeaderOrnament(doc, W, H - 38);

    doc.font('Helvetica')
       .fontSize(7.5)
       .fillColor(COLORS.gray)
       .text('Cenaduría Loma Bonita  •  Gracias por su preferencia',
             0, H - 30, { align: 'center', width: W });
};

// ── GENERADOR DE PDF EN BUFFER ──────────────────────────
const generarMenuPDFBuffer = async () => {
    const platillos = await svc.getPlatillos();

    const menu = platillos.reduce((acc, p) => {
        const cat = p.Categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
    }, {});

    const comida  = menu['Comida']  || [];
    const bebidas = menu['Bebidas'] || [];
    const extras  = menu['Extras']  || [];

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const W = doc.page.width;
        const H = doc.page.height;
        const chunks = [];

        // Captura el PDF en buffer
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Fondo blanco
        doc.rect(0, 0, W, H).fill(COLORS.white);

        // Marco decorativo (todo en pdfkit, sin recursos externos)
        drawFrame(doc, W, H);

        // Header
        drawHeader(doc, W);

        // Bloques
        const gap   = 14;
        const colW  = (W - MARGIN * 2 - gap) / 2;
        const row1H = Math.max(180, Math.max(comida.length, bebidas.length) * 28 + 60);
        const row1Y = 134;

        drawBlock(doc, 'Platillos', comida,  MARGIN,               row1Y, colW, row1H);
        drawBlock(doc, 'Bebidas',   bebidas, MARGIN + colW + gap,  row1Y, colW, row1H);

        const row2Y = row1Y + row1H + gap;
        const row2H = Math.max(100, extras.length * 28 + 60);
        drawBlock(doc, 'Extras', extras, MARGIN, row2Y, W - MARGIN * 2, row2H);

        // Footer
        drawFooter(doc, W, H);

        doc.end();
    });
};

// ── EXPORT PRINCIPAL ─────────────────────────────────────
/**
 * Genera el PDF del menú y lo sube a Cloudinary
 * @returns {Promise<{url: string, previewUrl: string, secure_url: string}>}
 */
export const generarMenuPDF = async () => {
    // Generar PDF en buffer
    const pdfBuffer = await generarMenuPDFBuffer();
    
    // Subir a Cloudinary
    const result = await uploadPDFToCloudinary(pdfBuffer, 'menu-loma-bonita', 'menus');
    
    return result;
};