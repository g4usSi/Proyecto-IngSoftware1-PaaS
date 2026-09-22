-- Unidades decimales: 1 GB = 1,000,000,000 bytes; 1 MB = 1,000,000 bytes.
-- Ambos límites diarios del plan Free se aplican: se rechaza al superar cualquiera.
INSERT INTO plans (
  code, name, capacity_bytes, daily_upload_limit, daily_bytes_limit,
  monthly_price_gtq, active
) VALUES (
  'free', 'Free', 2000000000, 10, 200000000, 0.00, TRUE
);
-- Los precios de los planes de pago están pendientes de definición (los PDF
-- contienen rangos). No se inventan importes ni se simulan suscripciones.
