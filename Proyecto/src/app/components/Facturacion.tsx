import { useState, type FormEvent } from 'react';
import { Receipt, Plus, Search, Eye, X } from 'lucide-react';
import { mockFacturas as initialFacturas, mockClientes } from '../mockData';
import { Factura } from '../types';

const serviciosDisponibles = [
  { id: '1', nombre: 'Consulta veterinaria', precio: 50.0 },
  { id: '2', nombre: 'Vacunación', precio: 30.0 },
  { id: '3', nombre: 'Medicamentos', precio: 25.0 },
  { id: '4', nombre: 'Radiografía', precio: 80.0 },
  { id: '5', nombre: 'Cirugía menor', precio: 200.0 },
  { id: '6', nombre: 'Análisis de sangre', precio: 60.0 },
  { id: '7', nombre: 'Limpieza dental', precio: 90.0 },
  { id: '8', nombre: 'Desparasitación', precio: 20.0 },
];

export default function Facturacion() {
  const [facturas, setFacturas] = useState<Factura[]>(initialFacturas);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingFactura, setViewingFactura] = useState<Factura | null>(null);
  const [formData, setFormData] = useState<{
    clienteId: string;
    serviciosSeleccionados: string[];
  }>({
    clienteId: '',
    serviciosSeleccionados: [],
  });

  const facturasConDetalles = facturas.map(factura => {
    const cliente = mockClientes.find(c => c.id === factura.clienteId);
    return {
      ...factura,
      clienteNombre: cliente?.nombre || 'Sin asignar',
    };
  }).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const filteredFacturas = facturasConDetalles.filter(factura =>
    factura.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      clienteId: '',
      serviciosSeleccionados: [],
    });
    setShowModal(true);
  };

  const handleView = (factura: Factura) => {
    const cliente = mockClientes.find(c => c.id === factura.clienteId);
    setViewingFactura({
      ...factura,
      clienteNombre: cliente?.nombre,
    });
  };

  const toggleServicio = (servicioId: string) => {
    setFormData(prev => ({
      ...prev,
      serviciosSeleccionados: prev.serviciosSeleccionados.includes(servicioId)
        ? prev.serviciosSeleccionados.filter(id => id !== servicioId)
        : [...prev.serviciosSeleccionados, servicioId],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const servicios = formData.serviciosSeleccionados.map(id => {
      const servicio = serviciosDisponibles.find(s => s.id === id);
      return {
        servicioId: id,
        nombre: servicio?.nombre || '',
        precio: servicio?.precio || 0,
      };
    });

    const total = servicios.reduce((sum, s) => sum + s.precio, 0);

    const newFactura: Factura = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      fecha: new Date().toISOString().split('T')[0],
      servicios,
      total,
    };

    setFacturas([...facturas, newFactura]);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Facturación</h1>
          <p className="text-gray-600">Gestione las facturas y servicios prestados</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Facturas</p>
          <p className="text-3xl text-gray-900">{facturas.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Ingresos del Mes</p>
          <p className="text-3xl text-emerald-600">
            ${facturas
              .filter(f => f.fecha.startsWith('2026-03'))
              .reduce((sum, f) => sum + f.total, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
          <p className="text-3xl text-emerald-600">
            ${facturas.reduce((sum, f) => sum + f.total, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Nº Factura</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Cliente</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Fecha</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Servicios</th>
              <th className="text-right px-6 py-4 text-sm text-gray-700">Total</th>
              <th className="text-center px-6 py-4 text-sm text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.map((factura) => (
              <tr key={factura.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">#{factura.id}</td>
                <td className="px-6 py-4 text-gray-900">{factura.clienteNombre}</td>
                <td className="px-6 py-4 text-gray-600">{factura.fecha}</td>
                <td className="px-6 py-4 text-gray-600">{factura.servicios.length} servicio(s)</td>
                <td className="px-6 py-4 text-right text-emerald-600">${factura.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleView(factura)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFacturas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron facturas
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Detalle de Factura #{viewingFactura.id}</h2>
              <button
                onClick={() => setViewingFactura(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="text-gray-900">{viewingFactura.clienteNombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-gray-900">{viewingFactura.fecha}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-700 mb-3">Servicios</h3>
                <div className="space-y-2">
                  {viewingFactura.servicios.map((servicio, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-900">{servicio.nombre}</span>
                      <span className="text-gray-900">${servicio.precio.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg text-gray-900">Total</span>
                  <span className="text-2xl text-emerald-600">${viewingFactura.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setViewingFactura(null)}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
              <h2 className="text-xl text-gray-900">Nueva Factura</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cliente</label>
                <select
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {mockClientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Servicios</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {serviciosDisponibles.map(servicio => (
                    <label key={servicio.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.serviciosSeleccionados.includes(servicio.id)}
                          onChange={() => toggleServicio(servicio.id)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-gray-900">{servicio.nombre}</span>
                      </div>
                      <span className="text-gray-600">${servicio.precio.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.serviciosSeleccionados.length > 0 && (
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total a facturar:</span>
                    <span className="text-2xl text-emerald-600">
                      ${formData.serviciosSeleccionados
                        .reduce((sum, id) => {
                          const servicio = serviciosDisponibles.find(s => s.id === id);
                          return sum + (servicio?.precio || 0);
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

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
                  disabled={formData.serviciosSeleccionados.length === 0}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
