import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../mockData';
import { User } from '../types';
import { Stethoscope } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    const user = mockUsers.find((u) => u.username === username);

    if (user && password === 'password123') {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-center gap-3 mb-8">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl text-blue-900">VetCare</h1>
            <p className="text-gray-600 text-sm">Sistema de Gestión Veterinaria</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2 text-gray-700">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Usuarios de prueba:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• <strong>admin</strong> - Administrador</li>
            <li>• <strong>vet1</strong> - Veterinario</li>
            <li>• <strong>recep1</strong> - Recepcionista</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">Contraseña para todos: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}
