# Almacenamiento privado local

Esta carpeta no se sirve públicamente ni contiene archivos de ejemplo.

- `objects/`: destino permanente de los archivos WebP; es el valor predeterminado de `STORAGE_ROOT`.
- `tmp/`: originales temporales durante validación y conversión; eliminarlos al finalizar o fallar el procesamiento.

El módulo Storage deberá crear ambas carpetas cuando se implemente. Sus contenidos están excluidos de Git. Una `storage_key` como `ab/ab…64-caracteres….webp` es relativa a `STORAGE_ROOT`; la ruta absoluta y el hash compartido no deben permitir omitir la autorización del propietario de la imagen.

La base actual no recibe archivos ni ejecuta conversiones. No conservar el original como copia permanente.
