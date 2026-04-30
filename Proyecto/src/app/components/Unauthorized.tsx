import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center border border-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">Acceso denegado</h1>
        <p className="text-slate-600 mb-6">
          No tienes permisos para ver esta página. Si crees que este es un error, inicia sesión con otro rol.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
