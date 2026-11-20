// ============================================================
// TecnoSucre - 03: consultas básicas (CRUD)
// Ejecutar después de 01 y 02: mongosh --file 03_consultas_crud.js
// Al final la base queda exactamente como antes (220 documentos).
// ============================================================
use("tecnosucre");

function mostrar(titulo, datos) {
  print("\n=== " + titulo + " ===");
  printjson(datos);
}

// Limpieza previa para poder repetir el script
db.productos.deleteOne({ _id: "P031" });
db.clientes.deleteMany({ _id: { $in: ["C031", "C032"] } });

// ---------- 1. INSERCIÓN (Create) ----------
mostrar("insertOne: producto nuevo", db.productos.insertOne({
  _id: "P031",
  nombre: "Tablet Galaxy Tab A9",
  marca: "Samsung",
  categoria: "accesorios",
  precio: 780000,
  stock: NumberInt(15),
  activo: true,
  etiquetas: ["tablet", "nuevo"],
  especificaciones: { tipo: "tablet", pantalla_pulgadas: 8.7, almacenamiento_gb: 64 },
  fecha_creacion: new Date()
}));

mostrar("insertMany: dos clientes", db.clientes.insertMany([
  { _id: "C031", nombre: "Pedro Pablo Rios", correo: "pedro.rios@correo.com", telefono: "3001234567", ciudad: "Sincelejo", fecha_registro: new Date() },
  { _id: "C032", nombre: "Marta Lucia Diaz", correo: "marta.diaz@correo.com", telefono: "3009876543", ciudad: "Bogota", fecha_registro: new Date() }
]));

// ---------- 2. SELECCIÓN (Read) ----------
mostrar("find: todos los celulares", db.productos.find({ categoria: "celulares" }).toArray());
mostrar("find con proyección: productos Samsung (nombre y precio)",
  db.productos.find({ marca: "Samsung" }, { nombre: 1, precio: 1, _id: 0 }).toArray());
mostrar("find + sort + limit: 3 portátiles más caros",
  db.productos.find({ categoria: "portatiles" }).sort({ precio: -1 }).limit(3).toArray());
mostrar("findOne por _id", db.productos.findOne({ _id: "P010" }));

// ---------- 3. ACTUALIZACIÓN (Update) ----------
mostrar("updateOne con $set: cambiar precio", db.productos.updateOne({ _id: "P031" }, { $set: { precio: 750000 } }));
mostrar("updateOne con $push: agregar etiqueta", db.productos.updateOne({ _id: "P031" }, { $push: { etiquetas: "oferta" } }));
mostrar("updateMany con $inc: +10 de stock a los accesorios",
  db.productos.updateMany({ categoria: "accesorios" }, { $inc: { stock: NumberInt(10) } }));
mostrar("Resultado de la actualización", db.productos.findOne({ _id: "P031" }));

// ---------- 4. ELIMINACIÓN (Delete) ----------
mostrar("deleteOne: eliminar el producto P031", db.productos.deleteOne({ _id: "P031" }));
mostrar("deleteMany: eliminar los clientes C031 y C032",
  db.clientes.deleteMany({ _id: { $in: ["C031", "C032"] } }));

// ---------- Restaurar el stock de los accesorios originales ----------
db.productos.updateMany({ categoria: "accesorios" }, { $inc: { stock: NumberInt(-10) } });

mostrar("Conteo final por colección", db.getCollectionNames().map(c => c + ": " + db[c].countDocuments()));
