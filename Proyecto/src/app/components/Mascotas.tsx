import { useState, type FormEvent } from 'react';
import { PawPrint, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { mockMascotas as initialMascotas, mockClientes } from '../mockData';
import { Mascota } from '../types';

export default function Mascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>(initialMascotas);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);
  const [formData, setFormData] = useState<Omit<Mascota, 'id'>>({
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    peso: 0,
    clienteId: '',
  });

  const mascotasConCliente = mascotas.map(mascota => ({
    ...mascota,
    clienteNombre: mockClientes.find(c => c.id === mascota.clienteId)?.nombre || 'Sin asignar',
  }));

  const filteredMascotas = mascotasConCliente.filter(mascota =>
    mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingMascota(null);
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      peso: 0,
      clienteId: '',
    });
    setShowModal(true);
  };

  const handleEdit = (mascota: Mascota) => {
    setEditingMascota(mascota);
    setFormData({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      peso: mascota.peso,
      clienteId: mascota.clienteId,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta mascota?')) {
      setMascotas(mascotas.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingMascota) {
      setMascotas(mascotas.map(m => 
        m.id === editingMascota.id ? { ...m, ...formData } : m
      ));
    } else {
      const newMascota: Mascota = {
        id: Date.now().toString(),
        ...formData,
      };
      setMascotas([...mascotas, newMascota]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Gestión de Mascotas</h1>
          <p className="text-gray-600">Administre la información de las mascotas</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Mascota
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre, especie o dueño..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMascotas.map((mascota) => (
          <div key={mascota.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <PawPrint className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">{mascota.nombre}</h3>
                  <p className="text-sm text-gray-600">{mascota.especie} - {mascota.raza}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edad:</span>
                <span className="text-sm text-gray-900">{mascota.edad} años</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Peso:</span>
                <span className="text-sm text-gray-900">{mascota.peso} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dueño:</span>
                <span className="text-sm text-gray-900">{mascota.clienteNombre}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(mascota)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(mascota.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMascotas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron mascotas
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">
                {editingMascota ? 'Editar Mascota' : 'Nueva Mascota'}
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
                <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Especie</label>
                <input
                  type="text"
                  value={formData.especie}
                  onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Perro, Gato"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Raza</label>
                <input
                  type="text"
                  value={formData.raza}
                  onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dueño</label>
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {mockClientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                  ))}
                </select>
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingMascota ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
