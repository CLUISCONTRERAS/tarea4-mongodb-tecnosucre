// ============================================================
// TecnoSucre - 05: consultas de agregación (contar, sumar, promediar)
// Ejecutar: mongosh --file 05_agregaciones.js
// ============================================================
use("tecnosucre");

function mostrar(titulo, datos) {
  print("\n=== " + titulo + " ===");
  printjson(datos);
}

// ---------- CONTAR ----------
mostrar("7.1a countDocuments: total de productos", db.productos.countDocuments());

mostrar("7.1b Pedidos por estado ($sum: 1)",
  db.pedidos.aggregate([
    { $group: { _id: "$estado", cantidad_pedidos: { $sum: 1 } } },
    { $sort: { cantidad_pedidos: -1 } }
  ]).toArray());

mostrar("7.1c Productos por categoría",
  db.productos.aggregate([
    { $group: { _id: "$categoria", total_productos: { $sum: 1 } } },
    { $sort: { total_productos: -1 } }
  ]).toArray());

// ---------- SUMAR ----------
mostrar("7.2 Ventas totales por categoría (sin pedidos cancelados)",
  db.pedidos.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $unwind: "$items" },
    { $lookup: { from: "productos", localField: "items.producto_id", foreignField: "_id", as: "producto" } },
    { $unwind: "$producto" },
    { $group: {
        _id: "$producto.categoria",
        unidades_vendidas: { $sum: "$items.cantidad" },
        ventas_totales: { $sum: { $multiply: ["$items.cantidad", "$items.precio_unitario"] } }
    } },
    { $sort: { ventas_totales: -1 } }
  ]).toArray());

// ---------- PROMEDIAR ----------
mostrar("7.3 Precio promedio por marca",
  db.productos.aggregate([
    { $group: {
        _id: "$marca",
        productos: { $sum: 1 },
        precio_promedio: { $avg: "$precio" },
        precio_minimo: { $min: "$precio" },
        precio_maximo: { $max: "$precio" }
    } },
    { $project: {
        productos: 1,
        precio_promedio: { $round: ["$precio_promedio", 0] },
        precio_minimo: 1,
        precio_maximo: 1
    } },
    { $sort: { precio_promedio: -1 } }
  ]).toArray());

// ---------- RANKINGS ----------
mostrar("7.4 Los 5 productos más vendidos",
  db.pedidos.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.producto_id", unidades_vendidas: { $sum: "$items.cantidad" } } },
    { $sort: { unidades_vendidas: -1 } },
    { $limit: 5 },
    { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
    { $unwind: "$producto" },
    { $project: { _id: 0, producto: "$producto.nombre", marca: "$producto.marca", unidades_vendidas: 1 } }
  ]).toArray());

mostrar("7.5 Calificación promedio por producto (top 5)",
  db.resenas.aggregate([
    { $group: { _id: "$producto_id", calificacion_promedio: { $avg: "$calificacion" }, total_resenas: { $sum: 1 } } },
    { $sort: { calificacion_promedio: -1, total_resenas: -1 } },
    { $limit: 5 },
    { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
    { $unwind: "$producto" },
    { $project: { _id: 0, producto: "$producto.nombre", calificacion_promedio: { $round: ["$calificacion_promedio", 2] }, total_resenas: 1 } }
  ]).toArray());

mostrar("7.6 Los 5 clientes que más han comprado",
  db.pedidos.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $group: { _id: "$cliente_id", pedidos: { $sum: 1 }, total_comprado: { $sum: "$total" }, ticket_promedio: { $avg: "$total" } } },
    { $sort: { total_comprado: -1 } },
    { $limit: 5 },
    { $lookup: { from: "clientes", localField: "_id", foreignField: "_id", as: "cliente" } },
    { $unwind: "$cliente" },
    { $project: { _id: 0, cliente: "$cliente.nombre", ciudad: "$cliente.ciudad", pedidos: 1, total_comprado: 1, ticket_promedio: { $round: ["$ticket_promedio", 0] } } }
  ]).toArray());

// ---------- OTRAS ESTADÍSTICAS ----------
mostrar("7.7 Ventas por mes",
  db.pedidos.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } }, pedidos: { $sum: 1 }, ventas: { $sum: "$total" } } },
    { $sort: { _id: 1 } }
  ]).toArray());

mostrar("7.8 Inventario por categoría",
  db.productos.aggregate([
    { $group: { _id: "$categoria", unidades_en_stock: { $sum: "$stock" }, valor_inventario: { $sum: { $multiply: ["$precio", "$stock"] } } } },
    { $sort: { valor_inventario: -1 } }
  ]).toArray());

mostrar("7.9 Ventas por método de pago",
  db.pedidos.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $group: { _id: "$metodo_pago", pedidos: { $sum: 1 }, ventas: { $sum: "$total" } } },
    { $sort: { ventas: -1 } }
  ]).toArray());
