import { useState, type FormEvent } from 'react';
import { FileText, Plus, Search, Eye, X } from 'lucide-react';
import { mockRegistrosClinico as initialRegistros, mockMascotas, mockClientes, mockUsers } from '../mockData';
import { RegistroClinico } from '../types';

export default function HistorialClinico() {
  const [registros, setRegistros] = useState<RegistroClinico[]>(initialRegistros);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingRegistro, setViewingRegistro] = useState<RegistroClinico | null>(null);
  const [formData, setFormData] = useState<Omit<RegistroClinico, 'id'>>({
    mascotaId: '',
    veterinarioId: '',
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });

  const registrosConDetalles = registros.map(registro => {
    const mascota = mockMascotas.find(m => m.id === registro.mascotaId);
    const veterinario = mockUsers.find(u => u.id === registro.veterinarioId);
    return {
      ...registro,
      mascotaNombre: mascota?.nombre || 'Sin asignar',
      veterinarioNombre: veterinario?.nombre || 'Sin asignar',
    };
  }).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const filteredRegistros = registrosConDetalles.filter(registro =>
    registro.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setFormData({
      mascotaId: '',
      veterinarioId: currentUser.id || '',
      fecha: new Date().toISOString().split('T')[0],
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
    });
    setShowModal(true);
  };

  const handleView = (registro: RegistroClinico) => {
    const mascota = mockMascotas.find(m => m.id === registro.mascotaId);
    const veterinario = mockUsers.find(u => u.id === registro.veterinarioId);
    setViewingRegistro({
      ...registro,
      mascotaNombre: mascota?.nombre,
      veterinarioNombre: veterinario?.nombre,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newRegistro: RegistroClinico = {
      id: Date.now().toString(),
      ...formData,
    };
    setRegistros([...registros, newRegistro]);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Historial Clínico</h1>
          <p className="text-gray-600">Consulte y registre información clínica de las mascotas</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Registro
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por mascota o diagnóstico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredRegistros.map((registro) => (
          <div key={registro.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">{registro.mascotaNombre}</h3>
                    <p className="text-sm text-gray-600">{registro.fecha} - {registro.veterinarioNombre}</p>
                  </div>
                </div>
                <div className="ml-12 space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Diagnóstico:</span>
                    <p className="text-gray-900">{registro.diagnostico}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tratamiento:</span>
                    <p className="text-gray-900">{registro.tratamiento}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleView(registro)}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRegistros.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron registros clínicos
        </div>
      )}

      {/* View Modal */}
      {viewingRegistro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Detalles del Registro Clínico</h2>
              <button
                onClick={() => setViewingRegistro(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mascota</p>
                  <p className="text-gray-900">{viewingRegistro.mascotaNombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-gray-900">{viewingRegistro.fecha}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Veterinario</p>
                  <p className="text-gray-900">{viewingRegistro.veterinarioNombre}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Diagnóstico</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{viewingRegistro.diagnostico}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tratamiento</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{viewingRegistro.tratamiento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Observaciones</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{viewingRegistro.observaciones}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingRegistro(null)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Nuevo Registro Clínico</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Mascota</label>
                  <select
                    value={formData.mascotaId}
                    onChange={(e) => setFormData({ ...formData, mascotaId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="block text-sm text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Diagnóstico</label>
                <textarea
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tratamiento</label>
                <textarea
                  value={formData.tratamiento}
                  onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
