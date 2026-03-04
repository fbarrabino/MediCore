import api from '../api/axiosConfig';

export const guardarEvolucion = async (data) => {
  const response = await api.post("/evoluciones", data);
  return response.data;
};

export const obtenerHistorial = async (pacienteId) => {
  const response = await api.get(`/evoluciones/paciente/${pacienteId}`);
  return response.data;
};

export const actualizarEvolucion = async (id, data) => {
  const response = await api.put(`/evoluciones/${id}`, data);
  return response.data;
};

export const eliminarEvolucion = async (id) => {
  const response = await api.delete(`/evoluciones/${id}`);
  return response.data;
};