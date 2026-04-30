import { useState, type FormEvent } from 'react';
import { Package, Plus, Search, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import { mockProductos as initialProductos } from '../mockData';
import { Producto } from '../types';

export default function Inventario() {
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<Omit<Producto, 'id'>>({
    nombre: '',
    categoria: '',
    cantidad: 0,
    stockMinimo: 0,
    precio: 0,
  });

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosStockBajo = productos.filter(p => p.cantidad < p.stockMinimo);

  const handleAdd = () => {
    setEditingProducto(null);
    setFormData({
      nombre: '',
      categoria: '',
      cantidad: 0,
      stockMinimo: 0,
      precio: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      cantidad: producto.cantidad,
      stockMinimo: producto.stockMinimo,
      precio: producto.precio,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingProducto) {
      setProductos(productos.map(p => 
        p.id === editingProducto.id ? { ...p, ...formData } : p
      ));
    } else {
      const newProducto: Producto = {
        id: Date.now().toString(),
        ...formData,
      };
      setProductos([...productos, newProducto]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Inventario</h1>
          <p className="text-gray-600">Gestione productos y medicamentos</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Alertas de Stock Bajo */}
      {productosStockBajo.length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-orange-900">
              ¡Atención! {productosStockBajo.length} producto(s) con stock bajo
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {productosStockBajo.map(p => (
              <span key={p.id} className="text-sm bg-white px-3 py-1 rounded-full text-orange-700">
                {p.nombre} ({p.cantidad} unidades)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Productos</p>
          <p className="text-3xl text-gray-900">{productos.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Stock Total</p>
          <p className="text-3xl text-amber-600">{productos.reduce((sum, p) => sum + p.cantidad, 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Valor Inventario</p>
          <p className="text-3xl text-amber-600">
            ${productos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Producto</th>
              <th className="text-left px-6 py-4 text-sm text-gray-700">Categoría</th>
              <th className="text-center px-6 py-4 text-sm text-gray-700">Cantidad</th>
              <th className="text-center px-6 py-4 text-sm text-gray-700">Stock Mínimo</th>
              <th className="text-right px-6 py-4 text-sm text-gray-700">Precio Unit.</th>
              <th className="text-right px-6 py-4 text-sm text-gray-700">Valor Total</th>
              <th className="text-center px-6 py-4 text-sm text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => {
              const stockBajo = producto.cantidad < producto.stockMinimo;
              return (
                <tr key={producto.id} className={`border-b border-gray-100 hover:bg-gray-50 ${stockBajo ? 'bg-orange-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {stockBajo && <AlertCircle className="w-4 h-4 text-orange-600" />}
                      <span className="text-gray-900">{producto.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{producto.categoria}</td>
                  <td className={`px-6 py-4 text-center ${stockBajo ? 'text-orange-600' : 'text-gray-900'}`}>
                    {producto.cantidad}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{producto.stockMinimo}</td>
                  <td className="px-6 py-4 text-right text-gray-900">${producto.precio.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-amber-600">
                    ${(producto.cantidad * producto.precio).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(producto)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProductos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron productos
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
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
                <label className="block text-sm text-gray-700 mb-1">Nombre del producto</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Vacunas">Vacunas</option>
                  <option value="Medicamentos">Medicamentos</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Precio unitario ($)</label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  min="0"
                  step="0.01"
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
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingProducto ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
