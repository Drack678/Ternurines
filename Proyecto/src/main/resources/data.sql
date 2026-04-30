INSERT INTO cliente (nombre, documento, telefono, direccion, correo, contrasena) VALUES
('Carlos Ramírez',    '1020304050', '3101234567', 'Calle 45 #12-30, Bogotá',    'carlos.ramirez@gmail.com',  'hash_pass_001'),
('Laura Gómez',       '1030405060', '3209876543', 'Carrera 7 #80-15, Bogotá',   'laura.gomez@hotmail.com',   'hash_pass_002'),
('Andrés Martínez',   '1040506070', '3154567890', 'Av. 68 #22-10, Bogotá',      'andres.martinez@gmail.com', 'hash_pass_003'),
('Sofía Herrera',     '1050607080', '3001122334', 'Calle 100 #50-20, Bogotá',   'sofia.herrera@yahoo.com',   'hash_pass_004'),
('Miguel Torres',     '1060708090', '3112233445', 'Transversal 9 #34-60, Bogotá','miguel.torres@gmail.com',  'hash_pass_005'),
('Luis Mora', '1002003001', '3001112233', 'Calle 49 #12-34, Bogotá', 'laura@gmail.com', 'hash_pass_006'),
('Ana Rico', '1002003002', '3004445566', 'Carrera 10 #56-78, Bogotá', 'carlos@gmail.com', 'hash_pass_007');

INSERT INTO veterinario (nombre, documento, telefono, correo, especialidad, num_licencia, contrasena) VALUES
('Dra. Valentina Ríos',  '52001122', '3123344556', 'v.rios@veterinaria.com',    'Medicina Interna',    'VET-COL-001', 'hash_vet_001'),
('Dr. Julián Ospina',    '80223344', '3134455667', 'j.ospina@veterinaria.com',  'Cirugía',             'VET-COL-002', 'hash_vet_002'),
('Dra. Camila Vargas',   '52334455', '3145566778', 'c.vargas@veterinaria.com',  'Dermatología',        'VET-COL-003', 'hash_vet_003'),
('Dr. Santiago Muñoz',   '80445566', '3156677889', 's.munoz@veterinaria.com',   'Odontología',         'VET-COL-004', 'hash_vet_004'),
('Dra. Isabela Castro',  '52556677', '3167788990', 'i.castro@veterinaria.com',  'Traumatología',       'VET-COL-005', 'hash_vet_005');

INSERT INTO recepcionista (nombre, documento, telefono, correo, contrasena) VALUES
('Paola Suárez',    '1071122334', '3178899001', 'p.suarez@veterinaria.com',  'hash_rec_001'),
('Diego Morales',   '1072233445', '3189900112', 'd.morales@veterinaria.com', 'hash_rec_002'),
('Natalia Peña',    '1073344556', '3190011223', 'n.pena@veterinaria.com',    'hash_rec_003');

INSERT INTO administrador (nombre, documento, telefono, correo, contrasena) VALUES
('Roberto Jiménez', '1081122334', '3201122334', 'r.jimenez@veterinaria.com', 'hash_adm_001'),
('Gloria Nieto',    '1082233445', '3212233445', 'g.nieto@veterinaria.com',   'hash_adm_002');

INSERT INTO mascota (id_cliente, nombre, especie, raza, edad, peso, sexo) VALUES
(1, 'Rocky',   'Perro', 'Labrador',         3, 28.5, 'Macho'),
(1, 'Luna',    'Gato',  'Siamés',           2,  4.2, 'Hembra'),
(2, 'Max',     'Perro', 'Pastor Alemán',    5, 35.0, 'Macho'),
(3, 'Mia',     'Gato',  'Persa',            1,  3.8, 'Hembra'),
(4, 'Toby',    'Perro', 'Bulldog Francés',  4, 12.0, 'Macho'),
(4, 'Bella',   'Perro', 'Golden Retriever', 6, 30.5, 'Hembra'),
(5, 'Simba',   'Gato',  'Maine Coon',       3,  6.1, 'Macho'),
(5, 'Nala',    'Perro', 'Poodle',           2,  8.3, 'Hembra');

INSERT INTO mascota_adopcion (id_recepcionista, nombre, especie, raza, edad, estado_salud, estado_adopcion, fecha_ingreso) VALUES
(1, 'Pelusa',  'Gato',  'Mestizo',          1, 'Saludable',          'Disponible',   '2024-11-10'),
(1, 'Bruno',   'Perro', 'Mestizo',          3, 'Saludable',          'Disponible',   '2024-12-01'),
(2, 'Coco',    'Perro', 'Chihuahua',        2, 'En tratamiento',     'Disponible',   '2025-01-15'),
(2, 'Mochi',   'Gato',  'Mestizo',          4, 'Saludable',          'Adoptado',     '2025-02-20'),
(3, 'Duque',   'Perro', 'Dálmata',          5, 'Recuperación',       'Disponible',   '2025-03-05');

INSERT INTO cita (id_mascota, id_veterinario, id_recepcionista, fecha, hora, motivo, estado) VALUES
(1, 1, 1, '2025-03-10', '08:00', 'Consulta general',         'Completada'),
(2, 3, 1, '2025-03-11', '09:30', 'Problema de piel',         'Completada'),
(3, 2, 2, '2025-03-12', '10:00', 'Revisión post-cirugía',    'Completada'),
(4, 1, 2, '2025-03-13', '11:00', 'Vacunación',               'Completada'),
(5, 4, 3, '2025-03-14', '14:00', 'Limpieza dental',          'Completada'),
(6, 5, 1, '2025-03-17', '08:30', 'Cojera en pata delantera', 'Completada'),
(7, 1, 2, '2025-03-18', '10:00', 'Control de peso',          'Completada'),
(8, 3, 3, '2025-03-20', '15:00', 'Alergia cutánea',          'Pendiente'),
(1, 2, 1, '2025-04-05', '09:00', 'Esterilización',           'Pendiente'),
(3, 1, 2, '2025-04-10', '11:30', 'Vacunación anual',         'Pendiente');

INSERT INTO servicio (nombre, descripcion, precio) VALUES
('Consulta General',     'Revisión médica básica del animal',                35000),
('Vacunación',           'Aplicación de vacunas según esquema',              45000),
('Cirugía Mayor',        'Procedimiento quirúrgico de alta complejidad',    350000),
('Cirugía Menor',        'Procedimiento quirúrgico de baja complejidad',    120000),
('Limpieza Dental',      'Profilaxis y limpieza dental con ultrasonido',     80000),
('Baño y Peluquería',    'Servicio de higiene y estética',                   40000),
('Ecografía',            'Diagnóstico por imagen abdominal o torácica',      90000),
('Laboratorio Clínico',  'Exámenes de sangre, orina y materia fecal',        60000),
('Hospitalización',      'Estancia con monitoreo por día',                   80000),
('Desparasitación',      'Aplicación de antiparasitarios internos/externos', 30000);

INSERT INTO cita_servicio (id_cita, id_servicio) VALUES
(1, 1),
(1, 8),
(2, 1),
(2, 8),
(3, 1),
(4, 1),
(4, 2),
(5, 5),
(6, 1),
(6, 7),
(7, 1),
(8, 1),
(9, 4),
(10, 2);

INSERT INTO medicamento (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Amoxicilina 250mg',    'Antibiótico de amplio espectro',          12000,  80, '2026-06-30'),
(1, 'Meloxicam 1mg/ml',     'Antiinflamatorio y analgésico',            9500, 100, '2026-08-31'),
(1, 'Ivermectina 1%',       'Antiparasitario interno y externo',        8000, 120, '2026-12-31'),
(2, 'Metronidazol 250mg',   'Antibiótico y antiprotozoario',           11000,  60, '2026-09-30'),
(2, 'Furosemida 40mg',      'Diurético para insuficiencia cardíaca',   14000,  50, '2026-05-31'),
(1, 'Prednisona 5mg',       'Corticoide antiinflamatorio',              7500,  90, '2027-01-31'),
(2, 'Enrofloxacina 50mg',   'Antibiótico fluoroquinolona',             13000,  70, '2026-11-30'),
(1, 'Tramadol 50mg',        'Analgésico opioide para dolor severo',    18000,  40, '2026-07-31');

INSERT INTO historial_medico (id_mascota, id_veterinario, fecha, diagnostico, observaciones) VALUES
(1, 1, '2025-03-10', 'Paciente sano. Peso adecuado.',                  'Vacunas al día. Control en 6 meses.'),
(2, 3, '2025-03-11', 'Dermatitis alérgica leve.',                      'Se recomienda cambio de alimento.'),
(3, 2, '2025-03-12', 'Recuperación post-operatoria satisfactoria.',    'Retirar puntos en 10 días.'),
(4, 1, '2025-03-13', 'Paciente sana. Esquema de vacunación iniciado.', 'Próxima vacuna en 3 semanas.'),
(5, 4, '2025-03-14', 'Sarro dental grado II. Sin enfermedad periodontal.','Control anual recomendado.'),
(6, 5, '2025-03-17', 'Fractura incompleta en radio izquierdo.',        'Reposo total por 4 semanas. Radiografía de control.'),
(7, 1, '2025-03-18', 'Sobrepeso leve. IMC elevado.',                   'Dieta hipocalórica y ejercicio moderado.');

INSERT INTO tratamiento (id_historial, id_medicamento, descripcion, dosis, fecha_inicio, fecha_fin) VALUES
(2, 2, 'Tratamiento antiinflamatorio para dermatitis',     '1ml/10kg cada 24h',    '2025-03-11', '2025-03-21'),
(2, 6, 'Corticoide para reducir inflamación cutánea',      '1 tableta cada 12h',   '2025-03-11', '2025-03-18'),
(3, 1, 'Antibiótico preventivo post-cirugía',              '1 cápsula cada 12h',   '2025-03-12', '2025-03-22'),
(3, 2, 'Analgésico para manejo del dolor post-operatorio', '0.5ml/kg cada 24h',    '2025-03-12', '2025-03-19'),
(4, 3, 'Desparasitación interna como parte del protocolo', '0.2ml/kg dosis única', '2025-03-13', '2025-03-13'),
(6, 8, 'Analgesia por fractura en radio',                  '2mg/kg cada 8h',       '2025-03-17', '2025-03-24'),
(7, 2, 'Antiinflamatorio articular para apoyo locomotor',  '0.1mg/kg cada 24h',    '2025-03-18', '2025-03-28');

INSERT INTO producto (id_administrador, nombre, descripcion, precio, stock, fecha_vencimiento) VALUES
(1, 'Alimento Royal Canin Adulto 3kg', 'Concentrado premium para perros adultos',     85000, 30, '2026-10-31'),
(1, 'Alimento Hill''s Science Diet 2kg','Alimento terapéutico para control de peso',  78000, 25, '2026-09-30'),
(2, 'Collar antipulgas Seresto',        'Collar de acción prolongada 8 meses',         95000, 40, '2027-03-31'),
(2, 'Shampoo medicado Malaseb',         'Shampoo antifúngico y antibacterial',         32000, 50, '2026-12-31'),
(1, 'Arena sanitaria Premium 10kg',     'Arena aglutinante sin polvo para gatos',      28000, 60, NULL),
(2, 'Juguete Kong Classic M',           'Juguete resistente de caucho natural',         35000, 20, NULL),
(1, 'Bebedero automático 2L',           'Fuente de agua con filtro de carbón activado', 65000, 15, NULL),
(2, 'Pipeta Frontline Plus gatos',      'Antiparasitario tópico para gatos',            42000, 45, '2026-08-31');

INSERT INTO adoptante (nombre, documento, telefono, direccion, correo) VALUES
('Fernanda López',  '1091122334', '3221122334', 'Calle 22 #5-10, Bogotá',        'fernanda.lopez@gmail.com'),
('Ricardo Soto',    '1092233445', '3232233445', 'Carrera 15 #90-40, Bogotá',     'ricardo.soto@hotmail.com'),
('Marcela Rueda',   '1093344556', '3243344556', 'Av. Suba #112-30, Bogotá',      'marcela.rueda@gmail.com'),
('Esteban Vargas',  '1094455667', '3254455667', 'Calle 80 #45-20, Bogotá',       'esteban.vargas@yahoo.com');

INSERT INTO adopcion (id_adoptante, id_mascota_adopcion, fecha_adopcion) VALUES
(1, 4, '2025-03-01'),
(2, 2, '2025-03-15'),
(3, 1, '2025-03-22'),
(4, 3, '2025-04-01');

INSERT INTO usuario (username, contrasena, rol) VALUES
('admin', 'admin123', 'ADMIN'),
('recepcionista', 'recepcion123', 'RECEPCIONISTA'),
('veterinario', 'veterinario123', 'VETERINARIO');
