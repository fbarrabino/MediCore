import api from '../api/axiosConfig';

export const obtenerReportes = async (periodo = '6_meses') => {
    const response = await api.get(`/reportes?periodo=${periodo}`);
    return response.data;
};
