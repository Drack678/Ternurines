import { Users, PawPrint, Calendar, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { mockClientes, mockMascotas, mockCitas, mockProductos } from '../mockData';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [citasHoy, setCitasHoy] = useState(0);
  const [productosStockBajo, setProductosStockBajo] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const citasDeHoy = mockCitas.filter(c => c.fecha === today && c.estado === 'programada');
    setCitasHoy(citasDeHoy.length);

    const stockBajo = mockProductos.filter(p => p.cantidad < p.stockMinimo);
    setProductosStockBajo(stockBajo.length);
  }, []);

  const stats = [
    {
      title: 'Clientes Registrados',
      value: mockClientes.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Mascotas Activas',
      value: mockMascotas.length,
      icon: PawPrint,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Citas Hoy',
      value: citasHoy,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Stock Bajo',
      value: productosStockBajo,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const proximasCitas = mockCitas
    .filter(c => c.estado === 'programada')
    .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
    .slice(0, 5)
    .map(cita => {
      const mascota = mockMascotas.find(m => m.id === cita.mascotaId);
      const cliente = mockClientes.find(c => c.id === mascota?.clienteId);
      return { ...cita, mascotaNombre: mascota?.nombre, clienteNombre: cliente?.nombre };
    });

  const productosAlerta = mockProductos
    .filter(p => p.cantidad < p.stockMinimo)
    .sort((a, b) => a.cantidad - b.cantidad);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className={`text-3xl ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Citas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl text-gray-900">Próximas Citas</h2>
          </div>
          <div className="space-y-3">
            {proximasCitas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay citas programadas</p>
            ) : (
              proximasCitas.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900">{cita.mascotaNombre}</p>
                    <p className="text-sm text-gray-600">{cita.clienteNombre}</p>
                    <p className="text-xs text-gray-500">{cita.motivo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{cita.fecha}</p>
                    <p className="text-sm text-blue-600">{cita.hora}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alertas de Inventario */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl text-gray-900">Alertas de Inventario</h2>
          </div>
          <div className="space-y-3">
            {productosAlerta.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay productos con stock bajo</p>
            ) : (
              productosAlerta.map((producto) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">{producto.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-orange-600">Stock: {producto.cantidad}</p>
                    <p className="text-xs text-gray-500">Mínimo: {producto.stockMinimo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
