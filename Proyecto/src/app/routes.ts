import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Mascotas from './components/Mascotas';
import Citas from './components/Citas';
import HistorialClinico from './components/HistorialClinico';
import Facturacion from './components/Facturacion';
import Inventario from './components/Inventario';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'clientes',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Clientes />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mascotas',
        element: (
          <ProtectedRoute>
            <Mascotas />
          </ProtectedRoute>
        ),
      },
      {
        path: 'citas',
        element: (
          <ProtectedRoute>
            <Citas />
          </ProtectedRoute>
        ),
      },
      {
        path: 'historial',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'veterinario']}>
            <HistorialClinico />
          </ProtectedRoute>
        ),
      },
      {
        path: 'facturacion',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'recepcionista']}>
            <Facturacion />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventario />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        Component: Unauthorized,
      },
    ],
  },
]);
