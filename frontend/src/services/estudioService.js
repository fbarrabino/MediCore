import api from '../api/axiosConfig';

export const obtenerEstudiosPorPaciente = async (pacienteId) => {
    const res = await api.get(`/estudios/paciente/${pacienteId}`);
    return res.data;
};

export const guardarEstudio = async (estudio) => {
    const res = await api.post(`/estudios`, estudio);
    return res.data;
};

export const eliminarEstudio = async (id) => {
    await api.delete(`/estudios/${id}`);
};
