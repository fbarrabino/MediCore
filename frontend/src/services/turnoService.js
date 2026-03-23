import api from '../api/axiosConfig';

export const crearTurno = async (dto) => {
    try {
        const response = await api.post("/turnos", dto);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || 'Error al crear el turno');
    }
};

export const obtenerTurnosDeHoy = async () => {
    try {
        const response = await api.get("/turnos/hoy");
        return response.data;
    } catch (err) {
        throw new Error('Error al obtener los turnos de hoy');
    }
};

export const obtenerTodosLosTurnos = async () => {
    try {
        const response = await api.get("/turnos");
        return response.data;
    } catch (err) {
        throw new Error('Error al obtener todos los turnos');
    }
};

export const obtenerSalaDeEspera = async () => {
    try {
        const response = await api.get("/turnos/sala-espera");
        return response.data;
    } catch (err) {
        throw new Error('Error al obtener la sala de espera');
    }
};

export const actualizarEstadoTurno = async (id, estado) => {
    try {
        const response = await api.patch(`/turnos/${id}/estado`, { estado });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || 'Error al actualizar el estado');
    }
};

export const cancelarTurno = async (id) => {
    try {
        const response = await api.delete(`/turnos/${id}`);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.error || 'Error al cancelar el turno');
    }
};
