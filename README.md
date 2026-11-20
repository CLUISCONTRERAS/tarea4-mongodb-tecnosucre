# TecnoSucre: base de datos MongoDB para una tienda en línea de tecnología

Proyecto individual de la **Tarea 4 – Almacenamiento y Consultas de Datos en Big Data**
Curso: Big Data (código 202016911) · Universidad Nacional Abierta y a Distancia (UNAD)
Autor: Luis Angel

## Descripción del caso de uso

TecnoSucre es una tienda en línea que vende celulares, portátiles, audífonos y accesorios.
MongoDB es apropiado porque cada categoría de producto tiene atributos distintos
(un celular tiene RAM y cámara; un portátil, procesador y pantalla; unos audífonos, batería y conectividad).
Con el esquema flexible cada documento guarda solo los campos que le corresponden, y datos como las
especificaciones, la dirección de envío y los ítems de un pedido se almacenan anidados en el mismo documento.

## Requisitos

- MongoDB Community Server y MongoDB Compass (o `mongosh`)
- Base de datos local en `mongodb://localhost:27017`

## Contenido del repositorio

| Archivo | Qué hace |
|---|---|
| `01_crear_colecciones_e_indices.js` | Crea las 4 colecciones con validación de esquema (`$jsonSchema`) y los índices |
| `02_cargar_datos.js` | Carga 220 documentos de prueba (datos deterministas, sin aleatoriedad) |
| `03_consultas_crud.js` | Inserción, selección, actualización y eliminación; deja la base como estaba |
| `04_filtros_y_lookup.js` | Filtros con operadores (`$gt`, `$in`, `$and`, `$or`, `$regex`) y tres joins con `$lookup` |
| `05_agregaciones.js` | Contar, sumar, promediar y rankings con `$group`, `$sum`, `$avg`, `$min`, `$max` |

## Cómo ejecutarlo

Ejecutar en este orden (cada comando desde la carpeta del repositorio):

```bash
mongosh --file 01_crear_colecciones_e_indices.js
mongosh --file 02_cargar_datos.js
mongosh --file 03_consultas_crud.js
mongosh --file 04_filtros_y_lookup.js
mongosh --file 05_agregaciones.js
```

También se puede abrir cada archivo, copiar su contenido y pegarlo en la consola `mongosh` de Compass.
El archivo `01` elimina las colecciones si ya existen, y el `02` limpia antes de cargar,
por lo que se pueden repetir sin duplicar datos.

## Diseño del esquema

Base de datos: `tecnosucre` · 4 colecciones · 220 documentos.

```
clientes (1) ────< (N) pedidos (1) ────< (N) items ──> (1) productos
clientes (1) ────< (N) resenas  >──── (1) productos
```

**Decisión de diseño.** Se *incrusta* lo que siempre se lee junto (especificaciones del producto, dirección
de envío e ítems del pedido) y se *referencia* lo que existe por sí solo o crece sin límite (clientes y reseñas).
Cada ítem guarda `precio_unitario` como copia del precio al momento de la compra (patrón *snapshot*),
para que los pedidos históricos no cambien si el precio del producto cambia.

### productos (30 documentos)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | String | Código, ej. `P001` |
| `nombre` | String | Nombre comercial |
| `marca` | String | Marca |
| `categoria` | String | `celulares`, `portatiles`, `audifonos`, `accesorios` |
| `precio` | Number | Precio en COP |
| `stock` | Number (entero) | Unidades disponibles |
| `activo` | Boolean | Si está a la venta |
| `etiquetas` | Array de String | Etiquetas |
| `especificaciones` | Object | Varía según la categoría |
| `fecha_creacion` | Date | Fecha de alta |

### clientes (30 documentos)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | String | Ej. `C001` |
| `nombre` | String | Nombre completo |
| `correo` | String | Único (índice único) |
| `telefono` | String | Contacto |
| `ciudad` | String | Ciudad |
| `fecha_registro` | Date | Alta en la tienda |

### pedidos (100 documentos)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | String | Ej. `PED001` |
| `cliente_id` | String | Referencia a `clientes._id` |
| `fecha` | Date | Fecha del pedido |
| `estado` | String | `pendiente`, `pagado`, `enviado`, `entregado`, `cancelado` |
| `metodo_pago` | String | `tarjeta`, `pse`, `contraentrega` |
| `direccion_envio` | Object | `{ ciudad, direccion }` |
| `items` | Array de Object | `{ producto_id, cantidad, precio_unitario }` |
| `total` | Number | Suma de cantidad × precio_unitario |

### resenas (60 documentos)

| Campo | Tipo | Descripción |
|---|---|---|
| `_id` | String | Ej. `R001` |
| `producto_id` | String | Referencia a `productos._id` |
| `cliente_id` | String | Referencia a `clientes._id` |
| `calificacion` | Number (entero) | De 1 a 5 |
| `comentario` | String | Texto de la reseña |
| `fecha` | Date | Fecha de publicación |

## Índices

- `clientes.correo` (único)
- `pedidos.cliente_id`
- `pedidos.items.producto_id`
- `resenas.producto_id`

## Notas

- Los datos son de prueba y se generan con fórmulas fijas, por lo que los resultados de las consultas
  son siempre los mismos al repetir la carga.
- Los nombres de colecciones y campos están escritos sin tildes ni eñ (`resenas`) para evitar problemas en terminales y herramientas.
- Con la validación activa, los campos enteros (`stock`, `cantidad`, `calificacion`) requieren `NumberInt()`.
