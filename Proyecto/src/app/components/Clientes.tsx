import { useState, type FormEvent } from 'react';
import { Users, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { mockClientes as initialClientes } from '../mockData';
import { Cliente } from '../types';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Omit<Cliente, 'id'>>({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    correo: '',
  });

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.documento.includes(searchTerm) ||
    cliente.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCliente(null);
    setFormData({
      nombre: '',
      documento: '',
      telefono: '',
      direccion: '',
      correo: '',
    });
    setShowModal(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      documento: cliente.documento,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      correo: cliente.correo,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingCliente) {
      setClientes(clientes.map(c => 
        c.id === editingCliente.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCliente: Cliente = {
        id: Date.now().toString(),
        ...formData,
      };
      setClientes([...clientes, newCliente]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Gestión de Clientes</h1>
          <p className="text-gray-600">Administre la información de los clientes</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre, documento o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Nombre</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Documento</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Teléfono</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Correo</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Dirección</th>
              <th className="text-center px-6 py-4 text-sm text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{cliente.nombre}</td>
                <td className="px-6 py-4 text-gray-600">{cliente.documento}</td>
                <td className="px-6 py-4 text-gray-600">{cliente.telefono}</td>
                <td className="px-6 py-4 text-gray-600">{cliente.correo}</td>
                <td className="px-6 py-4 text-gray-600">{cliente.direccion}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClientes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron clientes
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Documento</label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCliente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
