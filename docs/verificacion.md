# Verificación del esqueleto

Comprobaciones realizadas sobre esta entrega:

- `npm run check`: sintaxis del backend y compilación de React completadas.
- `npm test`: seis pruebas HTTP/configuración correctas, incluyendo rutas privadas cerradas, catálogo sin pérdida de precisión y CORS para localhost/127.0.0.1.
- `npm install`: auditoría sin vulnerabilidades reportadas al instalar.
- Migraciones aplicadas en una instancia temporal aislada de PostgreSQL 18; una segunda ejecución omitió correctamente las migraciones ya aplicadas.
- Verificación SQL transaccional: dos usuarios pueden referenciar un objeto único; la PK rechaza objetos con el mismo hash; la FK impide usar una carpeta ajena y borrar un objeto aún referenciado.
- `/api/ready` y `/api/plans` comprobados contra esa base real; plan Free de 2 GB, 10 subidas y 200 MB diarios.
- Revisión en navegador de portada, login pendiente, catálogo disponible/no disponible y biblioteca en pantalla móvil de 390 px.

Los fixtures SQL se revirtieron y la instancia temporal se cerró. No se modificaron bases preexistentes del equipo. Docker Compose no se ejecutó porque Docker no está instalado en este entorno.

Estas comprobaciones validan la base técnica. No demuestran autenticación, procesamiento de archivos, cuotas, pagos ni deduplicación operativa: esas funciones siguen pendientes. La prueba SQL verifica la estructura necesaria para deduplicar, no una subida completa.
