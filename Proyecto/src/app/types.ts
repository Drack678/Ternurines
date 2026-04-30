// Types for the veterinary system

export type UserRole = 'administrador' | 'veterinario' | 'recepcionista';

export interface User {
  id: string;
  username: string;
  nombre: string;
  role: UserRole;
}

export interface Cliente {
  id: string;
  nombre: string;
  documento: string;
  telefono: string;
  direccion: string;
  correo: string;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  clienteId: string;
  clienteNombre?: string;
}

export interface Cita {
  id: string;
  mascotaId: string;
  mascotaNombre?: string;
  clienteNombre?: string;
  veterinarioId: string;
  veterinarioNombre?: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'programada' | 'completada' | 'cancelada';
}

export interface RegistroClinico {
  id: string;
  mascotaId: string;
  mascotaNombre?: string;
  veterinarioId: string;
  veterinarioNombre?: string;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
}

export interface Factura {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  fecha: string;
  servicios: { servicioId: string; nombre: string; precio: number }[];
  total: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  stockMinimo: number;
  precio: number;
}
