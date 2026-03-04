import api from '../api/axiosConfig';

export const buscarPacientePorDni = async (dni) => {
    try {
        const response = await api.get(`/pacientes/dni/${dni}`);
        return response.data;
    } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
    }
};

export const obtenerPacientePorId = async (id) => {
    try {
        const response = await api.get(`/pacientes/${id}`);
        return response.data;
    } catch (err) {
        throw new Error('Error al obtener el paciente');
    }
};

export const actualizarPaciente = async (id, pacienteData) => {
    try {
        const response = await api.put(`/pacientes/${id}`, pacienteData);
        return response.data;
    } catch (err) {
        throw new Error('Error al actualizar paciente');
    }
};

export const guardarPaciente = async (pacienteData) => {
    try {
        const response = await api.post(`/pacientes`, pacienteData);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || 'Error al crear paciente');
    }
};

export const obtenerTodosLosPacientes = async () => {
    try {
        const response = await api.get(`/pacientes`);
        return response.data;
    } catch (err) {
        throw new Error('Error al obtener la lista de pacientes');
    }
};

export const eliminarPaciente = async (id) => {
    try {
        const response = await api.delete(`/pacientes/${id}`);
        return response.data;
    } catch (err) {
        throw new Error('Error al eliminar el paciente');
    }
};