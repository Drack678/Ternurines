import { useState, type FormEvent } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, X, CheckCircle, XCircle } from 'lucide-react';
import { mockCitas as initialCitas, mockMascotas, mockClientes, mockUsers } from '../mockData';
import { Cita } from '../types';

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>(initialCitas);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [formData, setFormData] = useState<Omit<Cita, 'id'>>({
    mascotaId: '',
    veterinarioId: '',
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'programada',
  });

  const citasConDetalles = citas.map(cita => {
    const mascota = mockMascotas.find(m => m.id === cita.mascotaId);
    const cliente = mockClientes.find(c => c.id === mascota?.clienteId);
    const veterinario = mockUsers.find(u => u.id === cita.veterinarioId);
    return {
      ...cita,
      mascotaNombre: mascota?.nombre || 'Sin asignar',
      clienteNombre: cliente?.nombre || 'Sin asignar',
      veterinarioNombre: veterinario?.nombre || 'Sin asignar',
    };
  });

  const filteredCitas = citasConDetalles.filter(cita =>
    cita.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCita(null);
    setFormData({
      mascotaId: '',
      veterinarioId: '',
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'programada',
    });
    setShowModal(true);
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    setFormData({
      mascotaId: cita.mascotaId,
      veterinarioId: cita.veterinarioId,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      setCitas(citas.map(c => c.id === id ? { ...c, estado: 'cancelada' as const } : c));
    }
  };

  const handleComplete = (id: string) => {
    setCitas(citas.map(c => c.id === id ? { ...c, estado: 'completada' as const } : c));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingCita) {
      setCitas(citas.map(c => 
        c.id === editingCita.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCita: Cita = {
        id: Date.now().toString(),
        ...formData,
      };
      setCitas([...citas, newCita]);
    }
    setShowModal(false);
  };

  const getEstadoBadge = (estado: Cita['estado']) => {
    const styles = {
      programada: 'bg-blue-100 text-blue-700',
      completada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[estado]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Gestión de Citas</h1>
          <p className="text-gray-600">Administre las citas veterinarias</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por mascota, cliente o motivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredCitas.map((cita) => (
          <div key={cita.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg text-gray-900">{cita.mascotaNombre}</h3>
                  {getEstadoBadge(cita.estado)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 ml-8">
                  <div>
                    <span className="text-gray-500">Cliente:</span> {cita.clienteNombre}
                  </div>
                  <div>
                    <span className="text-gray-500">Veterinario:</span> {cita.veterinarioNombre}
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha:</span> {cita.fecha} a las {cita.hora}
                  </div>
                  <div>
                    <span className="text-gray-500">Motivo:</span> {cita.motivo}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {cita.estado === 'programada' && (
                  <>
                    <button
                      onClick={() => handleComplete(cita.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Completar"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(cita)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cita.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancelar"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCitas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron citas
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">
                {editingCita ? 'Editar Cita' : 'Nueva Cita'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Mascota</label>
                <select
                  value={formData.mascotaId}
                  onChange={(e) => setFormData({ ...formData, mascotaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Seleccione una mascota</option>
                  {mockMascotas.map(mascota => {
                    const cliente = mockClientes.find(c => c.id === mascota.clienteId);
                    return (
                      <option key={mascota.id} value={mascota.id}>
                        {mascota.nombre} ({cliente?.nombre})
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Veterinario</label>
                <select
                  value={formData.veterinarioId}
                  onChange={(e) => setFormData({ ...formData, veterinarioId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Seleccione un veterinario</option>
                  {mockUsers.filter(u => u.role === 'veterinario' || u.role === 'administrador').map(vet => (
                    <option key={vet.id} value={vet.id}>{vet.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Motivo</label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingCita ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
