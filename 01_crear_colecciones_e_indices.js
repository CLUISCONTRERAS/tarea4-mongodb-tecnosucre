// ============================================================
// TecnoSucre - 01: creación de colecciones con validación e índices
// Ejecutar: mongosh --file 01_crear_colecciones_e_indices.js
// (o pegar en la consola mongosh de Compass)
// ADVERTENCIA: elimina las colecciones si ya existen (para poder repetirlo).
// ============================================================
use("tecnosucre");

db.productos.drop();
db.clientes.drop();
db.pedidos.drop();
db.resenas.drop();

// ---------- productos ----------
db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "marca", "categoria", "precio", "stock", "activo", "especificaciones"],
      properties: {
        _id: { bsonType: "string" },
        nombre: { bsonType: "string" },
        marca: { bsonType: "string" },
        categoria: { enum: ["celulares", "portatiles", "audifonos", "accesorios"] },
        precio: { bsonType: ["int", "long", "double"], minimum: 0 },
        stock: { bsonType: ["int", "long"], minimum: 0 },
        activo: { bsonType: "bool" },
        etiquetas: { bsonType: "array", items: { bsonType: "string" } },
        especificaciones: { bsonType: "object" },
        fecha_creacion: { bsonType: "date" }
      }
    }
  }
});

// ---------- clientes ----------
db.createCollection("clientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "correo", "ciudad", "fecha_registro"],
      properties: {
        _id: { bsonType: "string" },
        nombre: { bsonType: "string" },
        correo: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        telefono: { bsonType: "string" },
        ciudad: { bsonType: "string" },
        fecha_registro: { bsonType: "date" }
      }
    }
  }
});

// ---------- pedidos ----------
db.createCollection("pedidos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "cliente_id", "fecha", "estado", "metodo_pago", "direccion_envio", "items", "total"],
      properties: {
        _id: { bsonType: "string" },
        cliente_id: { bsonType: "string" },
        fecha: { bsonType: "date" },
        estado: { enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"] },
        metodo_pago: { enum: ["tarjeta", "pse", "contraentrega"] },
        direccion_envio: {
          bsonType: "object",
          required: ["ciudad", "direccion"],
          properties: {
            ciudad: { bsonType: "string" },
            direccion: { bsonType: "string" }
          }
        },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["producto_id", "cantidad", "precio_unitario"],
            properties: {
              producto_id: { bsonType: "string" },
              cantidad: { bsonType: ["int", "long"], minimum: 1 },
              precio_unitario: { bsonType: ["int", "long", "double"], minimum: 0 }
            }
          }
        },
        total: { bsonType: ["int", "long", "double"], minimum: 0 }
      }
    }
  }
});

// ---------- resenas ----------
db.createCollection("resenas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "producto_id", "cliente_id", "calificacion", "fecha"],
      properties: {
        _id: { bsonType: "string" },
        producto_id: { bsonType: "string" },
        cliente_id: { bsonType: "string" },
        calificacion: { bsonType: ["int", "long"], minimum: 1, maximum: 5 },
        comentario: { bsonType: "string" },
        fecha: { bsonType: "date" }
      }
    }
  }
});

// ---------- índices ----------
db.clientes.createIndex({ correo: 1 }, { unique: true });
db.pedidos.createIndex({ cliente_id: 1 });
db.pedidos.createIndex({ "items.producto_id": 1 });
db.resenas.createIndex({ producto_id: 1 });

print("Colecciones: " + db.getCollectionNames().join(", "));
print("Índices de pedidos: " + db.pedidos.getIndexes().map(i => i.name).join(", "));
