// ============================================================
// TecnoSucre - 04: filtros, operadores y $lookup (join)
// Ejecutar: mongosh --file 04_filtros_y_lookup.js
// ============================================================
use("tecnosucre");

function mostrar(titulo, datos) {
  print("\n=== " + titulo + " ===");
  printjson(datos);
}

// ---------- FILTROS Y OPERADORES ----------
mostrar("$gt y $lte: productos entre 1.000.000 y 3.000.000",
  db.productos.find({ precio: { $gt: 1000000, $lte: 3000000 } },
    { nombre: 1, marca: 1, precio: 1, _id: 0 }).toArray());

mostrar("$in: productos Samsung o Apple",
  db.productos.find({ marca: { $in: ["Samsung", "Apple"] } },
    { nombre: 1, marca: 1, categoria: 1, _id: 0 }).toArray());

mostrar("$and: portátiles < 3.500.000 con 16 GB de RAM o más",
  db.productos.find({
    $and: [
      { categoria: "portatiles" },
      { precio: { $lt: 3500000 } },
      { "especificaciones.ram_gb": { $gte: 16 } }
    ]
  }, { nombre: 1, precio: 1, "especificaciones.ram_gb": 1, _id: 0 }).toArray());

mostrar("$or: poco stock o en oferta",
  db.productos.find({ $or: [{ stock: { $lt: 10 } }, { etiquetas: "oferta" }] },
    { nombre: 1, stock: 1, etiquetas: 1, _id: 0 }).toArray());

mostrar("Campo anidado: audífonos con cancelación de ruido",
  db.productos.find({ "especificaciones.cancelacion_ruido": true },
    { nombre: 1, marca: 1, precio: 1, _id: 0 }).toArray());

mostrar("$regex: clientes cuyo nombre empieza por Maria",
  db.clientes.find({ nombre: { $regex: "^Maria" } }, { nombre: 1, ciudad: 1, _id: 0 }).toArray());

mostrar("countDocuments: pedidos entregados de más de 5.000.000",
  db.pedidos.countDocuments({ estado: "entregado", total: { $gt: 5000000 } }));

// ---------- JOINS CON $lookup ----------
mostrar("Join 1: pedidos con los datos de su cliente",
  db.pedidos.aggregate([
    { $match: { estado: "entregado" } },
    { $limit: 5 },
    { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
    { $unwind: "$cliente" },
    { $project: { fecha: 1, total: 1, "cliente.nombre": 1, "cliente.ciudad": 1 } }
  ]).toArray());

mostrar("Join 2: ítems del pedido PED003 con los datos del producto",
  db.pedidos.aggregate([
    { $match: { _id: "PED003" } },
    { $unwind: "$items" },
    { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
    { $unwind: "$producto" },
    { $project: { "producto.nombre": 1, "producto.marca": 1, "items.cantidad": 1, "items.precio_unitario": 1 } }
  ]).toArray());

mostrar("Join 3: reseñas con producto y cliente (dos $lookup)",
  db.resenas.aggregate([
    { $match: { calificacion: { $gte: 4 } } },
    { $limit: 5 },
    { $lookup: { from: "productos", localField: "producto_id", foreignField: "_id", as: "producto" } },
    { $lookup: { from: "clientes", localField: "cliente_id", foreignField: "_id", as: "cliente" } },
    { $unwind: "$producto" },
    { $unwind: "$cliente" },
    { $project: { _id: 0, calificacion: 1, comentario: 1, producto: "$producto.nombre", cliente: "$cliente.nombre" } }
  ]).toArray());
