const API_URL = 'http://localhost:3000/api/perfil';


export const getProfilesByUser = async (userId, token) => {
  try {
   
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron obtener los perfiles`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getProfilesByUser:", error);
    return [];
  }
};


export const createProfile = async (profileData, token) => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData) 
    });

    if (!response.ok) {
      throw new Error("Error al crear el perfil");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createProfile:", error);
    return null;
  }
};


export const updateProfile = async (profileId, data, token) => {
  try {
    const response = await fetch(`${API_URL}/${profileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el perfil");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateProfile:", error);
    return null;
  }
};


export const deleteProfile = async (profileId, token) => {
  try {
    const response = await fetch(`${API_URL}/${profileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok; 
  } catch (error) {
    console.error("Error en deleteProfile:", error);
    return false;
  }
};