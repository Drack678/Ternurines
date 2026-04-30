// Mock data for the veterinary system
import { Cliente, Mascota, Cita, RegistroClinico, Factura, Producto, User } from './types';

export const mockUsers: User[] = [
  { id: '1', username: 'admin', nombre: 'Dr. Carlos Rodríguez', role: 'administrador' },
  { id: '2', username: 'vet1', nombre: 'Dra. María González', role: 'veterinario' },
  { id: '3', username: 'recep1', nombre: 'Ana Martínez', role: 'recepcionista' },
];

export const mockClientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    documento: '12345678',
    telefono: '555-0101',
    direccion: 'Calle Principal 123',
    correo: 'juan.perez@email.com',
  },
  {
    id: '2',
    nombre: 'María López',
    documento: '87654321',
    telefono: '555-0102',
    direccion: 'Av. Libertad 456',
    correo: 'maria.lopez@email.com',
  },
  {
    id: '3',
    nombre: 'Pedro Sánchez',
    documento: '11223344',
    telefono: '555-0103',
    direccion: 'Calle 7 #89',
    correo: 'pedro.sanchez@email.com',
  },
  {
    id: '4',
    nombre: 'Laura Ramírez',
    documento: '44332211',
    telefono: '555-0104',
    direccion: 'Carrera 15 #23-45',
    correo: 'laura.ramirez@email.com',
  },
];

export const mockMascotas: Mascota[] = [
  {
    id: '1',
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Labrador',
    edad: 3,
    peso: 28.5,
    clienteId: '1',
  },
  {
    id: '2',
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Persa',
    edad: 2,
    peso: 4.2,
    clienteId: '1',
  },
  {
    id: '3',
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Pastor Alemán',
    edad: 5,
    peso: 35.0,
    clienteId: '2',
  },
  {
    id: '4',
    nombre: 'Mimi',
    especie: 'Gato',
    raza: 'Siamés',
    edad: 1,
    peso: 3.5,
    clienteId: '3',
  },
  {
    id: '5',
    nombre: 'Toby',
    especie: 'Perro',
    raza: 'Beagle',
    edad: 4,
    peso: 12.0,
    clienteId: '4',
  },
];

export const mockCitas: Cita[] = [
  {
    id: '1',
    mascotaId: '1',
    veterinarioId: '2',
    fecha: '2026-03-05',
    hora: '10:00',
    motivo: 'Consulta general',
    estado: 'programada',
  },
  {
    id: '2',
    mascotaId: '3',
    veterinarioId: '2',
    fecha: '2026-03-05',
    hora: '11:00',
    motivo: 'Vacunación',
    estado: 'programada',
  },
  {
    id: '3',
    mascotaId: '2',
    veterinarioId: '1',
    fecha: '2026-03-04',
    hora: '09:00',
    motivo: 'Control de peso',
    estado: 'completada',
  },
  {
    id: '4',
    mascotaId: '4',
    veterinarioId: '2',
    fecha: '2026-03-06',
    hora: '15:00',
    motivo: 'Revisión dental',
    estado: 'programada',
  },
];

export const mockRegistrosClinico: RegistroClinico[] = [
  {
    id: '1',
    mascotaId: '1',
    veterinarioId: '2',
    fecha: '2026-02-15',
    diagnostico: 'Infección de oído leve',
    tratamiento: 'Gotas óticas - 1 gota cada 12 horas por 7 días',
    observaciones: 'Paciente respondió bien al tratamiento. Control en 2 semanas.',
  },
  {
    id: '2',
    mascotaId: '3',
    veterinarioId: '2',
    fecha: '2026-01-20',
    diagnostico: 'Displasia de cadera grado 1',
    tratamiento: 'Suplementos articulares y control de peso',
    observaciones: 'Se recomienda ejercicio moderado. Evitar saltos.',
  },
  {
    id: '3',
    mascotaId: '2',
    veterinarioId: '1',
    fecha: '2026-03-04',
    diagnostico: 'Peso dentro del rango normal',
    tratamiento: 'Continuar con dieta actual',
    observaciones: 'Mascota en excelente condición.',
  },
];

export const mockFacturas: Factura[] = [
  {
    id: '1',
    clienteId: '1',
    fecha: '2026-02-15',
    servicios: [
      { servicioId: '1', nombre: 'Consulta veterinaria', precio: 50.0 },
      { servicioId: '3', nombre: 'Medicamentos', precio: 25.0 },
    ],
    total: 75.0,
  },
  {
    id: '2',
    clienteId: '2',
    fecha: '2026-01-20',
    servicios: [
      { servicioId: '1', nombre: 'Consulta veterinaria', precio: 50.0 },
      { servicioId: '4', nombre: 'Radiografía', precio: 80.0 },
    ],
    total: 130.0,
  },
];

export const mockProductos: Producto[] = [
  {
    id: '1',
    nombre: 'Vacuna antirrábica',
    categoria: 'Vacunas',
    cantidad: 45,
    stockMinimo: 20,
    precio: 15.0,
  },
  {
    id: '2',
    nombre: 'Antibiótico amoxicilina',
    categoria: 'Medicamentos',
    cantidad: 8,
    stockMinimo: 10,
    precio: 12.0,
  },
  {
    id: '3',
    nombre: 'Desparasitante',
    categoria: 'Medicamentos',
    cantidad: 60,
    stockMinimo: 25,
    precio: 8.0,
  },
  {
    id: '4',
    nombre: 'Alimento premium perro adulto',
    categoria: 'Alimentos',
    cantidad: 30,
    stockMinimo: 15,
    precio: 45.0,
  },
  {
    id: '5',
    nombre: 'Alimento premium gato',
    categoria: 'Alimentos',
    cantidad: 25,
    stockMinimo: 15,
    precio: 40.0,
  },
  {
    id: '6',
    nombre: 'Collar antipulgas',
    categoria: 'Accesorios',
    cantidad: 15,
    stockMinimo: 10,
    precio: 18.0,
  },
];
