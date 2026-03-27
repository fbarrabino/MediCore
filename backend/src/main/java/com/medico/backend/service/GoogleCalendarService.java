package com.medico.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.medico.backend.model.Turno;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "MediCore-CalendarSync";

    public void insertarTurnoEnGoogleCalendar(Turno turno, String accessToken) {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            return;
        }

        try {
            GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
            Calendar service = new Calendar.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    credential)
                    .setApplicationName(APPLICATION_NAME)
                    .build();

            Event event = new Event()
                    .setSummary("Turno médico: " + turno.getPaciente().getNombre())
                    .setDescription("Motivo de consulta: " + (turno.getMotivoConsulta() != null ? turno.getMotivoConsulta() : "No especificado"));

            LocalDateTime inicio = turno.getFechaHora();
            if (inicio == null) {
                inicio = LocalDateTime.now();
            }
            
            // Asumimos 30 minutos por turno por defecto
            LocalDateTime fin = inicio.plusMinutes(30);

            ZoneId zoneId = ZoneId.systemDefault();
            Date startDate = Date.from(inicio.atZone(zoneId).toInstant());
            Date endDate = Date.from(fin.atZone(zoneId).toInstant());

            EventDateTime start = new EventDateTime()
                    .setDateTime(new DateTime(startDate))
                    .setTimeZone(TimeZone.getDefault().getID());
            event.setStart(start);

            EventDateTime end = new EventDateTime()
                    .setDateTime(new DateTime(endDate))
                    .setTimeZone(TimeZone.getDefault().getID());
            event.setEnd(end);

            // Insertar el evento en el calendario principal del doctor
            service.events().insert("primary", event).execute();

        } catch (Exception e) {
            // Manejamos la excepción si el token es inválido o expira
            System.err.println("Advertencia: No se pudo sincronizar el turno con Google Calendar. Token inválido o expirado. Detalle: " + e.getMessage());
            // No lanzamos la excepción para no bloquear la creación local del turno
        }
    }
}
