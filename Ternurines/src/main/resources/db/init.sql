-- =============================================================================
-- 1. CREACIÓN DE TABLAS ESTRUCTURALES
-- =============================================================================

CREATE TABLE IF NOT EXISTS cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS veterinario (
    id_veterinario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100) NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    num_licencia VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS recepcionista (
    id_recepcionista SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS administrador (
    id_administrador SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS mascota (
    id_mascota SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50),
    raza VARCHAR(50),
    edad INT,
    peso FLOAT,
    sexo VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS mascota_adopcion (
    id_mascota_adopcion SERIAL PRIMARY KEY,
    id_recepcionista INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50),
    raza VARCHAR(50),
    edad INT,
    estado_salud VARCHAR(100),
    estado_adopcion VARCHAR(50),
    fecha_ingreso DATE
);

CREATE TABLE IF NOT EXISTS cita (
    id_cita SERIAL PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    id_recepcionista INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo VARCHAR(50),
    estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    precio FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS cita_servicio (
    id_cita INT NOT NULL,
    id_servicio INT NOT NULL,
    PRIMARY KEY (id_cita, id_servicio)
);

CREATE TABLE IF NOT EXISTS medicamento (
    id_medicamento SERIAL PRIMARY KEY,
    id_administrador INT NOT NULL,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    precio FLOAT NOT NULL,
    stock INT NOT NULL,
    fecha_vencimiento DATE
);

CREATE TABLE IF NOT EXISTS historial_medico (
    id_historial SERIAL PRIMARY KEY,
    id_mascota INT NOT NULL,
    id_veterinario INT NOT NULL,
    fecha DATE NOT NULL,
    diagnostico TEXT,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS tratamiento (
    id_tratamiento SERIAL PRIMARY KEY,
    id_historial INT NOT NULL,
    id_medicamento INT NOT NULL,
    descripcion TEXT,
    dosis VARCHAR(100),
    fecha_inicio DATE,
    fecha_fin DATE
);

CREATE TABLE IF NOT EXISTS producto (
    id_producto SERIAL PRIMARY KEY,
    id_administrador INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio FLOAT NOT NULL,
    stock INT NOT NULL,
    fecha_vencimiento DATE
);

CREATE TABLE IF NOT EXISTS adoptante (
    id_adoptante SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    correo VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS adopcion (
    id_adoptante INT NOT NULL,
    id_mascota_adopcion INT NOT NULL,
    fecha_adopcion DATE NOT NULL,
    PRIMARY KEY (id_adoptante, id_mascota_adopcion)
);

-- =============================================================================
-- 2. RESTRICCIONES
-- =============================================================================

ALTER TABLE mascota
    ADD CONSTRAINT fk_mascota_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE mascota_adopcion
    ADD CONSTRAINT fk_mascota_adopcion_recepcionista FOREIGN KEY (id_recepcionista) REFERENCES recepcionista(id_recepcionista) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE cita
    ADD CONSTRAINT fk_cita_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_cita_veterinario FOREIGN KEY (id_veterinario) REFERENCES veterinario(id_veterinario) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_cita_recepcionista FOREIGN KEY (id_recepcionista) REFERENCES recepcionista(id_recepcionista) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE cita_servicio
    ADD CONSTRAINT fk_cs_cita FOREIGN KEY (id_cita) REFERENCES cita(id_cita) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_cs_servicio FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE medicamento
    ADD CONSTRAINT fk_medicamento_admin FOREIGN KEY (id_administrador) REFERENCES administrador(id_administrador) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE historial_medico
    ADD CONSTRAINT fk_historial_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_historial_veterinario FOREIGN KEY (id_veterinario) REFERENCES veterinario(id_veterinario) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE tratamiento
    ADD CONSTRAINT fk_tratamiento_historial FOREIGN KEY (id_historial) REFERENCES historial_medico(id_historial) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_tratamiento_medicamento FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE producto
    ADD CONSTRAINT fk_producto_admin FOREIGN KEY (id_administrador) REFERENCES administrador(id_administrador) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE adoptante
    ADD CONSTRAINT chk_adoptante_documento CHECK (LENGTH(TRIM(documento)) >= 6);

ALTER TABLE adopcion
    ADD CONSTRAINT fk_adopcion_adoptante FOREIGN KEY (id_adoptante) REFERENCES adoptante(id_adoptante) ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT fk_adopcion_mascota FOREIGN KEY (id_mascota_adopcion) REFERENCES mascota_adopcion(id_mascota_adopcion) ON DELETE RESTRICT ON UPDATE CASCADE;

-- =============================================================================
-- 3. DATOS DE PRUEBA
-- =============================================================================

INSERT INTO administrador (nombre, documento, telefono, correo, contrasena) VALUES
('Carlos Admin', '1234567', '555-0101', 'admin@veterinaria.com', 'admin12345')
ON CONFLICT DO NOTHING;

INSERT INTO recepcionista (nombre, documento, telefono, correo, contrasena) VALUES
('Ana Recepcion', '2345678', '555-0202', 'ana.recep@veterinaria.com', 'recep12345'),
('Luis Front', '3456789', '555-0203', 'luis.front@veterinaria.com', 'front12345')
ON CONFLICT DO NOTHING;

INSERT INTO veterinario (nombre, documento, telefono, correo, especialidad, num_licencia, contrasena) VALUES
('Dr. Roberto Perez', '4567890', '555-0301', 'roberto.vet@vet.com', 'General', 'VET-001', 'vet12345'),
('Dra. Maria Lopez', '5678901', '555-0302', 'maria.vet@vet.com', 'Cirugía', 'VET-002', 'vet12345')
ON CONFLICT DO NOTHING;

INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES
('Juan Minero', '1111111', '555-1010', 'Calle Falsa 123', 'juan.m@gmail.com', 'juan12345'),
('Laura Galvis', '2222222', '555-2020', 'Av. Siempre Viva 742', 'laura.g@gmail.com', 'laura12345')
ON CONFLICT DO NOTHING;

INSERT INTO mascota (id_cliente, nombre, especie, raza, edad, peso, sexo) VALUES
(1, 'Firulais', 'Perro', 'Labrador', 3, 25.5, 'Macho'),
(1, 'Michi', 'Gato', 'Siamés', 2, 4.2, 'Hembra'),
(2, 'Poli', 'Ave', 'Loro', 10, 0.5, 'Macho')
ON CONFLICT DO NOTHING;

INSERT INTO mascota_adopcion (id_recepcionista, nombre, especie, raza, edad, estado_salud, estado_adopcion, fecha_ingreso) VALUES
(1, 'Rex', 'Perro', 'Criollo', 1, 'Saludable', 'Disponible', '2024-01-15'),
(2, 'Luna', 'Gato', 'Persa', 4, 'Recuperación', 'En proceso', '2024-02-01')
ON CONFLICT DO NOTHING;

INSERT INTO servicio (nombre, descripcion, precio) VALUES
('Consulta General', 'Revisión de rutina', 30.0),
('Vacunación', 'Aplicación de vacunas anuales', 20.0),
('Cirugía Menor', 'Procedimiento ambulatorio', 150.0)
ON CONFLICT DO NOTHING;

INSERT INTO producto (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Concentrado Pro-Plan', 'Bulto de 10kg', 60.0, 50, '2025-12-31'),
(1, 'Shampoo Antipulgas', 'Frasco 250ml', 15.0, 20, '2026-06-30')
ON CONFLICT DO NOTHING;

INSERT INTO medicamento (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Amoxicilina', 'Antibiótico', 12.0, 100, '2025-05-20'),
(1, 'Meloxicam', 'Antiinflamatorio', 8.5, 80, '2025-08-15')
ON CONFLICT DO NOTHING;

INSERT INTO cita (id_mascota, id_veterinario, id_recepcionista, fecha, hora, motivo, estado) VALUES
(1, 1, 1, '2024-03-20', '09:00:00', 'Chequeo anual', 'Completada'),
(2, 2, 2, '2024-03-21', '15:30:00', 'Dolor abdominal', 'Pendiente')
ON CONFLICT DO NOTHING;

INSERT INTO cita_servicio (id_cita, id_servicio) VALUES
(1, 1),
(1, 2),
(2, 1)
ON CONFLICT DO NOTHING;

INSERT INTO historial_medico (id_mascota, id_veterinario, fecha, diagnostico, observaciones) VALUES
(1, 1, '2024-03-20', 'Paciente sano', 'Se recomienda dieta baja en grasas')
ON CONFLICT DO NOTHING;

INSERT INTO tratamiento (id_historial, id_medicamento, descripcion, dosis, fecha_inicio, fecha_fin) VALUES
(1, 1, 'Refuerzo inmunológico', '1 pastilla diaria', '2024-03-20', '2024-03-27')
ON CONFLICT DO NOTHING;

-- Datos relacionados adicionales: cada cliente tiene mascotas, cada mascota tiene historial
-- y cada veterinario cuenta con citas asociadas.
INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES
('Sofia Torres', '3333333', '555-3030', 'Carrera 8 #45-12', 'sofia.t@gmail.com', 'sofia12345'),
('Mateo Rojas', '4444444', '555-4040', 'Diagonal 17 #9-80', 'mateo.r@gmail.com', 'mateo12345')
ON CONFLICT DO NOTHING;

INSERT INTO mascota (id_cliente, nombre, especie, raza, edad, peso, sexo) VALUES
(3, 'Nala', 'Perro', 'Beagle', 4, 12.8, 'Hembra'),
(3, 'Toby', 'Conejo', 'Mini Lop', 1, 1.9, 'Macho'),
(4, 'Kira', 'Gato', 'Criollo', 5, 4.8, 'Hembra')
ON CONFLICT DO NOTHING;

INSERT INTO mascota_adopcion (id_recepcionista, nombre, especie, raza, edad, estado_salud, estado_adopcion, fecha_ingreso) VALUES
(1, 'Mora', 'Perro', 'French Poodle', 2, 'Saludable', 'Disponible', '2024-02-20'),
(2, 'Simba', 'Gato', 'Criollo', 1, 'Vacunado', 'Adoptado', '2024-01-28')
ON CONFLICT DO NOTHING;

INSERT INTO servicio (nombre, descripcion, precio) VALUES
('Desparasitación', 'Tratamiento preventivo interno y externo', 18.0),
('Profilaxis Dental', 'Limpieza dental preventiva', 75.0),
('Control Postoperatorio', 'Seguimiento posterior a cirugía', 25.0)
ON CONFLICT DO NOTHING;

INSERT INTO producto (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Arena Sanitaria Premium', 'Bolsa aglomerante 8kg', 22.0, 35, '2027-01-31'),
(1, 'Correa Ajustable', 'Correa mediana para paseo', 11.5, 40, NULL),
(1, 'Cepillo Dental Mascotas', 'Kit de higiene oral', 9.0, 25, '2028-03-30')
ON CONFLICT DO NOTHING;

INSERT INTO medicamento (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Ivermectina', 'Antiparasitario', 10.0, 70, '2026-09-30'),
(1, 'Omeprazol Vet', 'Protector gástrico', 9.5, 45, '2026-11-15'),
(1, 'Suero Oral Pet', 'Rehidratante oral', 6.0, 60, '2026-04-10')
ON CONFLICT DO NOTHING;

INSERT INTO cita (id_mascota, id_veterinario, id_recepcionista, fecha, hora, motivo, estado) VALUES
(3, 1, 1, '2024-03-22', '10:00:00', 'Control de pico y plumaje', 'Completada'),
(4, 2, 2, '2024-03-23', '11:30:00', 'Vacunación inicial', 'Completada'),
(5, 1, 2, '2024-03-24', '14:00:00', 'Desparasitación', 'Completada'),
(6, 2, 1, '2024-03-25', '16:00:00', 'Control renal', 'Completada'),
(1, 2, 1, '2026-06-05', '09:30:00', 'Control preventivo', 'Pendiente'),
(2, 1, 2, '2026-06-06', '10:30:00', 'Vacuna anual', 'Pendiente'),
(3, 2, 1, '2026-06-07', '08:30:00', 'Revisión general', 'Pendiente'),
(4, 1, 1, '2026-06-08', '09:00:00', 'Consulta por tos', 'Pendiente'),
(5, 2, 2, '2026-06-08', '11:00:00', 'Control digestivo', 'Pendiente'),
(6, 1, 1, '2026-06-09', '15:00:00', 'Revisión de piel', 'Pendiente')
ON CONFLICT DO NOTHING;

INSERT INTO cita_servicio (id_cita, id_servicio) VALUES
(3, 1),
(4, 2),
(5, 4),
(6, 1),
(6, 5),
(7, 1),
(8, 2),
(9, 1),
(10, 1),
(11, 1),
(12, 1)
ON CONFLICT DO NOTHING;

INSERT INTO historial_medico (id_historial, id_mascota, id_veterinario, fecha, diagnostico, observaciones) VALUES
(2, 2, 2, '2024-03-21', 'Gastritis leve', 'Dieta blanda por 5 días y control si persiste el vómito'),
(3, 3, 1, '2024-03-22', 'Plumaje estable', 'Se recomienda enriquecimiento ambiental y corte preventivo de uñas'),
(4, 4, 2, '2024-03-23', 'Apto para vacunación', 'Sin fiebre ni signos respiratorios'),
(5, 5, 1, '2024-03-24', 'Parásitos intestinales leves', 'Repetir dosis en 15 días'),
(6, 6, 2, '2024-03-25', 'Control renal preventivo', 'Aumentar hidratación y revisar creatinina en 3 meses'),
(7, 1, 2, '2026-05-15', 'Control preventivo sin hallazgos graves', 'Peso ligeramente alto; aumentar caminatas')
ON CONFLICT (id_historial) DO UPDATE SET
    id_mascota = EXCLUDED.id_mascota,
    id_veterinario = EXCLUDED.id_veterinario,
    fecha = EXCLUDED.fecha,
    diagnostico = EXCLUDED.diagnostico,
    observaciones = EXCLUDED.observaciones;

INSERT INTO tratamiento (id_tratamiento, id_historial, id_medicamento, descripcion, dosis, fecha_inicio, fecha_fin) VALUES
(2, 2, 4, 'Protección gástrica antes de comida', '1/2 tableta cada 24 horas', '2024-03-21', '2024-03-26'),
(3, 3, 5, 'Rehidratación de apoyo', '5 ml cada 12 horas', '2024-03-22', '2024-03-24'),
(4, 4, 2, 'Antiinflamatorio posterior a vacuna si hay dolor', 'Según peso cada 24 horas', '2024-03-23', '2024-03-25'),
(5, 5, 3, 'Antiparasitario oral', 'Dosis única y refuerzo', '2024-03-24', '2024-04-08'),
(6, 6, 5, 'Soporte de hidratación oral', '10 ml cada 12 horas', '2024-03-25', '2024-03-31'),
(7, 7, 2, 'Manejo de dolor articular leve si aparece molestia', '1 tableta cada 24 horas', '2026-05-15', '2026-05-18')
ON CONFLICT (id_tratamiento) DO UPDATE SET
    id_historial = EXCLUDED.id_historial,
    id_medicamento = EXCLUDED.id_medicamento,
    descripcion = EXCLUDED.descripcion,
    dosis = EXCLUDED.dosis,
    fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin;

INSERT INTO adoptante (nombre, documento, telefono, direccion, correo) VALUES
('Pedro Picapiedra', '9999999', '555-9090', 'Rocadura 1', 'pedro@piedra.com'),
('Valentina Mora', '8888888', '555-8080', 'Calle 20 #11-33', 'valentina.mora@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO adopcion (id_adoptante, id_mascota_adopcion, fecha_adopcion) VALUES
(1, 1, '2024-02-10'),
(2, 4, '2024-03-02')
ON CONFLICT DO NOTHING;

SELECT setval(pg_get_serial_sequence('administrador', 'id_administrador'), COALESCE((SELECT MAX(id_administrador) FROM administrador), 1), true);
SELECT setval(pg_get_serial_sequence('recepcionista', 'id_recepcionista'), COALESCE((SELECT MAX(id_recepcionista) FROM recepcionista), 1), true);
SELECT setval(pg_get_serial_sequence('veterinario', 'id_veterinario'), COALESCE((SELECT MAX(id_veterinario) FROM veterinario), 1), true);
SELECT setval(pg_get_serial_sequence('cliente', 'id_cliente'), COALESCE((SELECT MAX(id_cliente) FROM cliente), 1), true);
SELECT setval(pg_get_serial_sequence('mascota', 'id_mascota'), COALESCE((SELECT MAX(id_mascota) FROM mascota), 1), true);
SELECT setval(pg_get_serial_sequence('mascota_adopcion', 'id_mascota_adopcion'), COALESCE((SELECT MAX(id_mascota_adopcion) FROM mascota_adopcion), 1), true);
SELECT setval(pg_get_serial_sequence('cita', 'id_cita'), COALESCE((SELECT MAX(id_cita) FROM cita), 1), true);
SELECT setval(pg_get_serial_sequence('servicio', 'id_servicio'), COALESCE((SELECT MAX(id_servicio) FROM servicio), 1), true);
SELECT setval(pg_get_serial_sequence('medicamento', 'id_medicamento'), COALESCE((SELECT MAX(id_medicamento) FROM medicamento), 1), true);
SELECT setval(pg_get_serial_sequence('historial_medico', 'id_historial'), COALESCE((SELECT MAX(id_historial) FROM historial_medico), 1), true);
SELECT setval(pg_get_serial_sequence('tratamiento', 'id_tratamiento'), COALESCE((SELECT MAX(id_tratamiento) FROM tratamiento), 1), true);
SELECT setval(pg_get_serial_sequence('producto', 'id_producto'), COALESCE((SELECT MAX(id_producto) FROM producto), 1), true);
SELECT setval(pg_get_serial_sequence('adoptante', 'id_adoptante'), COALESCE((SELECT MAX(id_adoptante) FROM adoptante), 1), true);

-- =============================================================================
-- 4. VISTAS
-- =============================================================================

CREATE OR REPLACE VIEW vista_agenda_diaria AS
SELECT
    c.id_cita,
    c.fecha,
    c.hora,
    v.nombre AS veterinario,
    m.nombre AS mascota,
    cl.nombre AS cliente,
    r.nombre AS recepcionista,
    c.motivo,
    c.estado
FROM cita c
JOIN veterinario v ON c.id_veterinario = v.id_veterinario
JOIN mascota m ON c.id_mascota = m.id_mascota
JOIN cliente cl ON m.id_cliente = cl.id_cliente
JOIN recepcionista r ON c.id_recepcionista = r.id_recepcionista;

CREATE OR REPLACE VIEW vista_reporte_ocupacion AS
SELECT
    v.id_veterinario,
    v.nombre AS nombre_veterinario,
    v.especialidad,
    COUNT(c.id_cita) AS total_citas_asignadas,
    SUM(CASE WHEN c.estado = 'Pendiente' THEN 1 ELSE 0 END) AS citas_pendientes,
    SUM(CASE WHEN c.estado = 'Completada' THEN 1 ELSE 0 END) AS citas_completadas,
    SUM(CASE WHEN c.estado = 'Cancelada' THEN 1 ELSE 0 END) AS citas_canceladas
FROM veterinario v
LEFT JOIN cita c ON v.id_veterinario = c.id_veterinario
GROUP BY v.id_veterinario, v.nombre, v.especialidad
ORDER BY total_citas_asignadas DESC;

CREATE OR REPLACE VIEW vista_clientes_contacto AS
SELECT nombre, telefono, correo
FROM cliente;

CREATE OR REPLACE VIEW vista_todas_mascotas AS
SELECT
    m.id_mascota AS id,
    m.nombre,
    m.especie,
    m.raza,
    m.sexo,
    c.nombre AS responsable,
    'Mascota de Cliente' AS tipo_registro,
    m.edad
FROM mascota m
JOIN cliente c ON m.id_cliente = c.id_cliente
UNION ALL
SELECT
    ma.id_mascota_adopcion AS id,
    ma.nombre,
    ma.especie,
    ma.raza,
    'Desconocido' AS sexo,
    'Recepcionista: ' || r.nombre AS responsable,
    'En Adopción' AS tipo_registro,
    ma.edad
FROM mascota_adopcion ma
JOIN recepcionista r ON ma.id_recepcionista = r.id_recepcionista;
