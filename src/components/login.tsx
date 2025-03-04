// components/login.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/supabase/auth/auth-client';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authClient.signIn(email, password);

      if (data) {
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Vertical dotted line */}
      <div className="absolute h-full border-l border-dashed border-gray-300"></div>

      <div className="w-full max-w-md px-4 sm:px-6 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="text-white text-xl sm:text-2xl font-bold">
              {/* P symbol with arrow */}
              <span className="flex items-center">
                P<span className="ml-1">→</span>
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
            PaisBank
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 mb-6">
            Comienza a manejar tu vida financiera
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full">
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-800 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-gray-800 text-sm font-medium mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-10 sm:mb-12">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded-sm bg-gray-200 border-none"
              />
              <span className="ml-2 text-gray-500 text-xs">Recordarme</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
