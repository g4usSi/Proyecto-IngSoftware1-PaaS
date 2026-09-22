# Procesamiento de imágenes pendiente

La base no inicia trabajadores ni simula tareas completadas. Cuando se implemente Storage, añadir Redis, BullMQ y Sharp para procesar imágenes de manera asíncrona.

Flujo acordado: validar subida → calcular SHA-256 de los bytes originales → consultar deduplicación global → reutilizar objeto existente o generar WebP → confirmar referencia privada del usuario → eliminar temporal original. Aplicar unicidad y transacciones para resolver subidas concurrentes del mismo contenido. Un fallo no debe dejar una referencia de archivo disponible ni eliminar objetos compartidos en uso.

El almacenamiento permanente conserva únicamente WebP. Guardar `original_size_bytes` como metadato del objeto compartido; obtener el tamaño WebP con `stat` al consultar métricas. El administrador consultará una única métrica de ahorro de disco, sin persistir porcentajes, bytes ahorrados ni históricos. Contar cada objeto físico una vez al calcular ahorro por optimización. Reutilizar un objeto físico nunca otorga acceso a las referencias de otros usuarios.

Las carpetas `backend/data/tmp` y `backend/data/objects` son privadas. No montar `express.static` sobre ellas.
