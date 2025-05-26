import React, { useState, createContext, useContext, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogOut, Shield, CheckCircle, AlertCircle } from 'lucide-react';

// Context para manejar la autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook personalizado para login
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // URL corregida según tu backend
  const API_BASE = 'http://localhost:5000/api/products'; // Tu URL actual

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Intentando login con:', { email, API_BASE }); // Debug
      
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para incluir cookies
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status); // Debug

      const data = await response.json();
      console.log('Response data:', data); // Debug

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      if (data.message === "login successful") {
        return { success: true, data };
      } else if (data.message === "user not found") {
        throw new Error('Usuario no encontrado');
      } else if (data.message === "Invalid password") {
        throw new Error('Contraseña incorrecta');
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug
      
      // Manejar errores específicos
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se puede conectar al servidor. Verifica que esté corriendo en puerto 5000.');
      } else {
        setError(err.message);
      }
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Verificar si hay cookie de autenticación
      const hasToken = document.cookie.includes('authToken');
      if (hasToken) {
        // Podrías hacer una llamada al backend para verificar el token
        setIsAuthenticated(true);
        // Simular datos de usuario (en producción obtenlos del backend)
        setUser({ email: 'usuario@ejemplo.com' });
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Opcional: llamar endpoint de logout en el backend
      await fetch('http://localhost:5000/api/products/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Error en logout:', error);
    }
    
    // Limpiar cookie y estado
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente para probar conexión
const ConnectionTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/products/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTestResult({ success: true, message: '✅ Backend conectado correctamente' });
      } else {
        setTestResult({ success: false, message: `❌ Backend responde con error: ${response.status}` });
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({ 
        success: false, 
        message: '❌ No se puede conectar. Verifica que tu backend esté corriendo en puerto 5000' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <button
        onClick={testConnection}
        disabled={testing}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mb-3"
      >
        {testing ? 'Probando conexión...' : 'Probar Conexión con Backend'}
      </button>
      
      {testResult && (
        <div className={`flex items-center p-3 rounded ${
          testResult.success 
            ? 'bg-green-100 border border-green-200 text-green-800'
            : 'bg-red-100 border border-red-200 text-red-800'
        }`}>
          {testResult.success ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {testResult.message}
        </div>
      )}
    </div>
  );
};

// Componente de Login
const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();
  const { login: authLogin } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      authLogin({ email: formData.email });
      onLoginSuccess && onLoginSuccess();
    }
  };

  // Función para llenar credenciales de prueba
  const fillTestCredentials = (type) => {
    const credentials = {
      admin: { email: 'admin@test.com', password: 'admin123' },
      employee: { email: 'empleado@test.com', password: 'password' },
      client: { email: 'cliente@test.com', password: 'password' }
    };
    
    setFormData(credentials[type]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        {/* Test de conexión */}
        <ConnectionTest />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 mr-2" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.email || !formData.password}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Credenciales de prueba:</p>
          <div className="space-y-2">
            <button
              onClick={() => fillTestCredentials('admin')}
              className="w-full text-left px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 rounded transition-colors"
            >
              <strong>Admin:</strong> admin@test.com / admin123
            </button>
            <button
              onClick={() => fillTestCredentials('employee')}
              className="w-full text-left px-3 py-2 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
            >
              <strong>Empleado:</strong> empleado@test.com / password
            </button>
            <button
              onClick={() => fillTestCredentials('client')}
              className="w-full text-left px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 rounded transition-colors"
            >
              <strong>Cliente:</strong> cliente@test.com / password
            </button>
          </div>
        </div>

        {/* Guía de troubleshooting */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">🔧 Si tienes problemas:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>1. Usa el botón "Probar Conexión"</li>
            <li>2. Verifica que tu backend corra en puerto 5000</li>
            <li>3. Agrega cors() en tu backend</li>
            <li>4. Verifica la ruta: /api/products/login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Componente Dashboard simple
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Panel de Control</h2>
          <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              ¡Login exitoso! Tu sistema JWT está funcionando correctamente.
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Marcas</h3>
              <p className="text-sm text-blue-600 mt-1">Gestionar marcas</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Productos</h3>
              <p className="text-sm text-green-600 mt-1">Administrar productos</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800">Clientes</h3>
              <p className="text-sm text-purple-600 mt-1">Ver clientes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente principal de la App
const LoginApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
};

// App principal con Provider
const LoginFull = () => {
  return (
    <AuthProvider>
      <LoginApp />
    </AuthProvider>
  );
};

export default LoginFull;