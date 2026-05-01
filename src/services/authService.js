// Antes tenías http://localhost:3000
const API_URL = "http://localhost:3000/api/auth"; 

export const loginUser = async (correo, password) => {
  try {
    // Ahora esto llamará a http://localhost:3000/api/auth/login
    const response = await fetch(`${API_URL}/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });
    return await response.json();
  } catch (error) {
    console.error("Error en el login:", error);
    return { error: "No se pudo conectar con el servidor" };
  }
};

export const registerUser = async (userData) => {
  try {
    // Ahora esto llamará a http://localhost:3000/api/auth/register
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error("Error en el registro:", error);
    return { error: "Error de red" };
  }
};