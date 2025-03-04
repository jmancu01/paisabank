// components/sign-up.tsx
'use client';

import { useState, FormEvent } from 'react';
import { authClient } from '@/lib/supabase/auth/auth-client';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [terms, setTerms] = useState<boolean>(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await authClient.signUp(email, password);

      if (data) {
        setMessage('Revisa tu correo para el enlace de confirmación!');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
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

        {/* Success message */}
        {message && (
          <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* SignUp Form */}
        <form onSubmit={handleSignUp} className="w-full">
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

          {/* Terms Checkbox */}
          <div className="mb-10 sm:mb-12">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={terms}
                onChange={() => setTerms(!terms)}
                required
                className="w-4 h-4 rounded-sm bg-gray-200 border-none"
              />
              <span className="ml-2 text-gray-500 text-xs">
                Acepto los términos y condiciones
              </span>
            </label>
          </div>

          {/* SignUp Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}
