// ============================================================
// TecnoSucre - Paso 4: carga de datos de prueba (220 documentos)
// 30 productos, 30 clientes, 100 pedidos, 60 resenas
// Pegar completo en mongosh (Compass). Es repetible: limpia antes de cargar.
// ============================================================
use("tecnosucre");
(function () {

db.productos.deleteMany({});
db.clientes.deleteMany({});
db.pedidos.deleteMany({});
db.resenas.deleteMany({});

// ---------- PRODUCTOS (30) ----------
const productos = [
  // celulares (8)
  { id:"P001", n:"Galaxy A55", m:"Samsung", c:"celulares", p:1450000, s:25, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:50, bateria_mah:5000}, t:["5g","gama media"] },
  { id:"P002", n:"Galaxy S24", m:"Samsung", c:"celulares", p:3600000, s:12, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:50, bateria_mah:4000}, t:["5g","gama alta"] },
  { id:"P003", n:"iPhone 15", m:"Apple", c:"celulares", p:4200000, s:10, e:{ram_gb:6, almacenamiento_gb:128, camara_mp:48, bateria_mah:3349}, t:["5g","gama alta"] },
  { id:"P004", n:"Redmi Note 13", m:"Xiaomi", c:"celulares", p:850000, s:40, e:{ram_gb:6, almacenamiento_gb:128, camara_mp:108, bateria_mah:5000}, t:["economico","oferta"] },
  { id:"P005", n:"Poco X6", m:"Xiaomi", c:"celulares", p:1250000, s:30, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:64, bateria_mah:5100}, t:["5g","gaming"] },
  { id:"P006", n:"Moto G54", m:"Motorola", c:"celulares", p:790000, s:35, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:50, bateria_mah:6000}, t:["economico"] },
  { id:"P007", n:"Edge 40", m:"Motorola", c:"celulares", p:1900000, s:15, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:50, bateria_mah:4400}, t:["5g","gama media"] },
  { id:"P008", n:"Honor X8b", m:"Honor", c:"celulares", p:980000, s:28, e:{ram_gb:8, almacenamiento_gb:256, camara_mp:108, bateria_mah:4500}, t:["oferta"] },
  // portatiles (8)
  { id:"P009", n:"IdeaPad Slim 3", m:"Lenovo", c:"portatiles", p:2300000, s:14, e:{procesador:"Core i5", ram_gb:8, almacenamiento_gb:512, pantalla_pulgadas:15.6}, t:["oficina"] },
  { id:"P010", n:"IdeaPad Gaming 3", m:"Lenovo", c:"portatiles", p:3200000, s:8, e:{procesador:"Ryzen 5", ram_gb:16, almacenamiento_gb:512, pantalla_pulgadas:15.6}, t:["gaming"] },
  { id:"P011", n:"Pavilion 14", m:"HP", c:"portatiles", p:2600000, s:11, e:{procesador:"Core i5", ram_gb:16, almacenamiento_gb:512, pantalla_pulgadas:14}, t:["oficina","estudiante"] },
  { id:"P012", n:"Victus 16", m:"HP", c:"portatiles", p:4100000, s:6, e:{procesador:"Ryzen 7", ram_gb:16, almacenamiento_gb:1024, pantalla_pulgadas:16.1}, t:["gaming"] },
  { id:"P013", n:"Vivobook 15", m:"Asus", c:"portatiles", p:2100000, s:18, e:{procesador:"Ryzen 5", ram_gb:8, almacenamiento_gb:256, pantalla_pulgadas:15.6}, t:["estudiante","oferta"] },
  { id:"P014", n:"TUF Gaming F15", m:"Asus", c:"portatiles", p:4600000, s:5, e:{procesador:"Core i7", ram_gb:16, almacenamiento_gb:512, pantalla_pulgadas:15.6}, t:["gaming"] },
  { id:"P015", n:"MacBook Air M2", m:"Apple", c:"portatiles", p:5900000, s:7, e:{procesador:"Apple M2", ram_gb:8, almacenamiento_gb:256, pantalla_pulgadas:13.6}, t:["premium"] },
  { id:"P016", n:"Inspiron 15", m:"Dell", c:"portatiles", p:2450000, s:12, e:{procesador:"Core i5", ram_gb:8, almacenamiento_gb:512, pantalla_pulgadas:15.6}, t:["oficina"] },
  // audifonos (7)
  { id:"P017", n:"WH-CH520", m:"Sony", c:"audifonos", p:230000, s:50, e:{tipo:"diadema", conectividad:"bluetooth", bateria_horas:50, cancelacion_ruido:false}, t:["economico"] },
  { id:"P018", n:"WH-1000XM5", m:"Sony", c:"audifonos", p:1350000, s:9, e:{tipo:"diadema", conectividad:"bluetooth", bateria_horas:30, cancelacion_ruido:true}, t:["premium"] },
  { id:"P019", n:"AirPods Pro 2", m:"Apple", c:"audifonos", p:1100000, s:20, e:{tipo:"in-ear", conectividad:"bluetooth", bateria_horas:6, cancelacion_ruido:true}, t:["premium"] },
  { id:"P020", n:"Buds2", m:"Samsung", c:"audifonos", p:380000, s:32, e:{tipo:"in-ear", conectividad:"bluetooth", bateria_horas:7, cancelacion_ruido:true}, t:["oferta"] },
  { id:"P021", n:"Tune 520BT", m:"JBL", c:"audifonos", p:210000, s:45, e:{tipo:"diadema", conectividad:"bluetooth", bateria_horas:57, cancelacion_ruido:false}, t:["economico"] },
  { id:"P022", n:"Quantum 100", m:"JBL", c:"audifonos", p:180000, s:38, e:{tipo:"diadema", conectividad:"cable", bateria_horas:0, cancelacion_ruido:false}, t:["gaming"] },
  { id:"P023", n:"Redmi Buds 5", m:"Xiaomi", c:"audifonos", p:120000, s:60, e:{tipo:"in-ear", conectividad:"bluetooth", bateria_horas:10, cancelacion_ruido:true}, t:["economico","oferta"] },
  // accesorios (7)
  { id:"P024", n:"Cargador 65W GaN", m:"Anker", c:"accesorios", p:140000, s:70, e:{tipo:"cargador", potencia_w:65, puertos:2}, t:["carga rapida"] },
  { id:"P025", n:"Power Bank 20000", m:"Xiaomi", c:"accesorios", p:130000, s:55, e:{tipo:"bateria externa", capacidad_mah:20000, puertos:2}, t:["viaje"] },
  { id:"P026", n:"Mouse MX Anywhere 3", m:"Logitech", c:"accesorios", p:420000, s:22, e:{tipo:"mouse", conectividad:"bluetooth", dpi:4000}, t:["oficina"] },
  { id:"P027", n:"Teclado K380", m:"Logitech", c:"accesorios", p:190000, s:30, e:{tipo:"teclado", conectividad:"bluetooth", idioma:"espanol"}, t:["oficina"] },
  { id:"P028", n:"Hub USB-C 7 en 1", m:"Anker", c:"accesorios", p:210000, s:26, e:{tipo:"hub", puertos:7, hdmi:true}, t:["portatil"] },
  { id:"P029", n:"Funda Galaxy A55", m:"Samsung", c:"accesorios", p:55000, s:80, e:{tipo:"funda", material:"silicona", compatible_con:"Galaxy A55"}, t:["economico"] },
  { id:"P030", n:"Soporte Portatil Aluminio", m:"Generico", c:"accesorios", p:85000, s:40, e:{tipo:"soporte", material:"aluminio", ajustable:true}, t:["escritorio"] }
];

db.productos.insertMany(productos.map((x, i) => ({
  _id: x.id,
  nombre: x.n,
  marca: x.m,
  categoria: x.c,
  precio: x.p,
  stock: NumberInt(x.s),
  activo: true,
  etiquetas: x.t,
  especificaciones: x.e,
  fecha_creacion: new Date(Date.UTC(2026, 0, 1 + i * 4))
})));

// ---------- CLIENTES (30) ----------
const nombres = ["Luis Angel Perez","Maria Fernanda Gomez","Carlos Andres Ruiz","Laura Camila Torres","Juan David Martinez",
  "Valentina Rojas","Santiago Herrera","Daniela Castro","Andres Felipe Diaz","Paula Andrea Mendoza",
  "Sebastian Vargas","Natalia Ortega","Camilo Jimenez","Sofia Ramirez","Jose Manuel Salcedo",
  "Ana Maria Pineda","Miguel Angel Barrios","Isabella Lopez","Jorge Luis Navarro","Karen Julieth Cardenas",
  "Diego Alejandro Fuentes","Lina Marcela Acosta","Ricardo Polo","Mariana Suarez","Edwin Arrieta",
  "Yesica Paola Montes","Oscar Mauricio Vega","Tatiana Bello","Fabian Cohen","Adriana Lucia Perea"];
const ciudades = ["Sincelejo","Bogota","Medellin","Cali","Barranquilla","Cartagena","Monteria","Bucaramanga"];
const direcciones = ["Cra 20 #15-30","Calle 25 #10-45","Av. Las Palmas #8-12","Cra 15 #30-22","Calle 40 #12-18",
  "Av. Principal #5-60","Cra 8 #22-14","Calle 12 #3-25"];

const clientes = nombres.map((nom, i) => ({
  _id: "C" + String(i + 1).padStart(3, "0"),
  nombre: nom,
  correo: nom.toLowerCase().replace(/ /g, ".") + "@correo.com",
  telefono: "300" + String(1000000 + i * 37311).slice(0, 7),
  ciudad: ciudades[i % ciudades.length],
  fecha_registro: new Date(Date.UTC(2025, i % 12, 1 + (i * 3) % 27))
}));
db.clientes.insertMany(clientes);

// ---------- PEDIDOS (100) ----------
const estados = ["entregado","entregado","entregado","enviado","pagado","pendiente","cancelado"];
const metodos = ["tarjeta","pse","contraentrega"];
const pedidos = [];
for (let i = 0; i < 100; i++) {
  const cli = clientes[(i * 7 + 3) % 30];
  const nItems = 1 + (i % 3);                       // 1 a 3 items
  const items = [];
  for (let k = 0; k < nItems; k++) {
    const prod = productos[(i * 7 + k * 13 + 3) % 30];
    // evitar producto repetido dentro del mismo pedido
    if (items.some(it => it.producto_id === prod.id)) continue;
    items.push({
      producto_id: prod.id,
      cantidad: NumberInt(1 + ((i + k) % 3)),
      precio_unitario: prod.p
    });
  }
  const total = items.reduce((acc, it) => acc + it.cantidad * it.precio_unitario, 0);
  const ciudadEnvio = cli.ciudad;
  pedidos.push({
    _id: "PED" + String(i + 1).padStart(3, "0"),
    cliente_id: cli._id,
    fecha: new Date(Date.UTC(2026, 5 + Math.floor(i / 25), 1 + (i * 2) % 28)),
    estado: estados[i % estados.length],
    metodo_pago: metodos[i % metodos.length],
    direccion_envio: { ciudad: ciudadEnvio, direccion: direcciones[i % direcciones.length] },
    items: items,
    total: total
  });
}
db.pedidos.insertMany(pedidos);

// ---------- RESENAS (60) ----------
const comentarios = {
  5: ["Excelente producto, super recomendado.", "Llego rapido y funciona perfecto.", "Muy buena calidad por el precio."],
  4: ["Muy bueno, cumple lo que promete.", "Buena compra, lo recomiendo.", "Funciona bien, solo el empaque llego golpeado."],
  3: ["Es aceptable, esperaba algo mejor.", "Cumple, pero nada especial.", "Regular, tiene detalles por mejorar."],
  2: ["No cumplio mis expectativas.", "Tuvo fallas a las pocas semanas."],
  1: ["Mala experiencia, llego con defectos."]
};
const notas = [5,5,5,4,4,4,4,3,3,2,5,4,5,3,4,1,5,4,5,4];
const resenas = [];
for (let i = 0; i < 60; i++) {
  const nota = notas[i % notas.length];
  const lista = comentarios[nota];
  resenas.push({
    _id: "R" + String(i + 1).padStart(3, "0"),
    producto_id: productos[(i * 7 + 1) % 30].id,
    cliente_id: clientes[(i * 11 + 5) % 30]._id,
    calificacion: NumberInt(nota),
    comentario: lista[i % lista.length],
    fecha: new Date(Date.UTC(2026, 6 + Math.floor(i / 20), 1 + (i * 3) % 28))
  });
}
db.resenas.insertMany(resenas);

// ---------- VERIFICACION ----------
print("productos: " + db.productos.countDocuments());
print("clientes:  " + db.clientes.countDocuments());
print("pedidos:   " + db.pedidos.countDocuments());
print("resenas:   " + db.resenas.countDocuments());
print("TOTAL:     " + (db.productos.countDocuments() + db.clientes.countDocuments() + db.pedidos.countDocuments() + db.resenas.countDocuments()));
})();
