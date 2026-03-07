package com.medico.backend.service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Properties;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    // En producción esto debería venir de una variable de entorno
    private static final String BACKEND_URL = "http://localhost:8080"; 

    @PostConstruct
    public void init() {
        try {
            Properties props = new Properties();
            File envFile = new File(".env");
            if (!envFile.exists()) {
                envFile = new File("backend/.env"); // Por si se ejecuta desde la raíz del workspace
            }
            if (envFile.exists()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        if (line.trim().isEmpty() || line.trim().startsWith("#")) continue;
                        String[] parts = line.split("=", 2);
                        if (parts.length == 2) {
                            props.setProperty(parts[0].trim(), parts[1].trim());
                        }
                    }
                }
            }

            String username = props.getProperty("SPRING_MAIL_USERNAME");
            String password = props.getProperty("SPRING_MAIL_PASSWORD");

            if (username != null && password != null) {
                JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
                mailSenderImpl.setHost("smtp.gmail.com");
                mailSenderImpl.setPort(587);
                mailSenderImpl.setUsername(username);
                mailSenderImpl.setPassword(password);

                Properties mailProps = mailSenderImpl.getJavaMailProperties();
                mailProps.put("mail.transport.protocol", "smtp");
                mailProps.put("mail.smtp.auth", "true");
                mailProps.put("mail.smtp.starttls.enable", "true");

                this.mailSender = mailSenderImpl;
                this.fromEmail = username;
                System.out.println("EmailService: Credenciales cargadas exitosamente desde .env (SMTP manual configurado)");
            } else {
                System.out.println("EmailService: No se encontraron credenciales SMTP en .env. Se usará la configuración por defecto.");
            }
        } catch (Exception e) {
            System.err.println("Error en EmailService al leer .env: " + e.getMessage());
        }
    } 

    @org.springframework.scheduling.annotation.Async
    public void enviarCorreoGenerico(String destinatario, String asunto, String cuerpoHtml) {
        if (destinatario == null || destinatario.isEmpty()) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(cuerpoHtml, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error enviando correo genérico a " + destinatario + ": " + e.getMessage());
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void enviarCorreoVerificacion(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Verificación de Cuenta - MediCore");

            String verificationUrl = "http://localhost:5173/verificar?token=" + token;

            String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                    "<h2 style='color: #2563eb; text-align: center;'>MediCore</h2>" +
                    "<p>Bienvenido/a a MediCore. Por favor, verifica tu cuenta haciendo clic en el siguiente botón:</p>" +
                    "<div style='text-align: center; margin: 30px 0;'>" +
                    "<a href='" + verificationUrl + "' style='background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Verificar Mi Cuenta</a>" +
                    "</div>" +
                    "<p>Si no creaste esta cuenta, ignora este mensaje.</p>" +
                    "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                    "<p style='font-size: 12px; color: #888; text-align: center;'>© 2026 MediCore</p>" +
                    "</div>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error al enviar correo de verificación: " + e.getMessage());
        }
    }

    public void sendResetPasswordEmail(String to, String token, String frontendUrl) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Recuperación de Contraseña - MediCore");

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        String content = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;'>" +
                "<h2 style='color: #2563eb; text-align: center;'>MediCore</h2>" +
                "<p>Hola,</p>" +
                "<p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + resetUrl + "' style='background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Restablecer Contraseña</a>" +
                "</div>" +
                "<p>Este enlace expirará en 1 hora.</p>" +
                "<p>Si no solicitaste este cambio, simplemente ignora este mensaje.</p>" +
                "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='font-size: 12px; color: #888; text-align: center;'>© 2026 MediCore - Gestión Clínica de Vanguardia</p>" +
                "</div>";

        helper.setText(content, true);
        mailSender.send(message);
    }
    @org.springframework.scheduling.annotation.Async
    public void enviarRecordatorioTurno(String to, String nombrePaciente, LocalDateTime fechaHora) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("\uD83D\uDCC5 Recordatorio: Tenés turno mañana - MediCore");

            DateTimeFormatter fechaFmt = DateTimeFormatter.ofPattern("EEEE d 'de' MMMM", Locale.forLanguageTag("es-AR"));
            DateTimeFormatter horaFmt  = DateTimeFormatter.ofPattern("HH:mm");
            String fechaStr = capitalize(fechaHora.format(fechaFmt));
            String horaStr  = fechaHora.format(horaFmt);

            String content =
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>" +
                "  <div style='background: linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e40af 100%); padding: 36px 32px; text-align: center;'>" +
                "    <div style='display:inline-block; background:rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 14px; margin-bottom: 16px;'>" +
                "      <span style='font-size:28px;'>\uD83D\uDC99</span>" +
                "    </div>" +
                "    <h1 style='color: white; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;'>MediCore</h1>" +
                "    <p style='color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;'>Recordatorio de Turno</p>" +
                "  </div>" +
                "  <div style='background: white; padding: 36px 32px;'>" +
                "    <h2 style='color: #1e293b; font-size: 22px; margin: 0 0 8px;'>¡Hola, " + nombrePaciente + "! \uD83D\uDC4B</h2>" +
                "    <p style='color: #64748b; font-size: 16px; margin: 0 0 28px; line-height: 1.6;'>" +
                "      Te escribimos para recordarte que <strong>mañana tenés turno médico</strong>. ¡No te olvides de asistir!" +
                "    </p>" +
                "    <div style='background: linear-gradient(135deg, #eff6ff, #eef2ff); border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 28px; text-align: center;'>" +
                "      <p style='color: #3730a3; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;'>\uD83D\uDCC5 Fecha de tu turno</p>" +
                "      <p style='color: #1e3a8a; font-size: 24px; font-weight: 900; margin: 0 0 4px;'>" + fechaStr + "</p>" +
                "      <p style='color: #1e40af; font-size: 18px; font-weight: 700; margin: 0;'>\uD83D\uDD52 " + horaStr + " hs</p>" +
                "    </div>" +
                "    <div style='background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 24px;'>" +
                "      <p style='color: #15803d; font-size: 14px; margin: 0; font-weight: 600;'>" +
                "        ✅ Recordá llegar 10 minutos antes y traer tu documentación." +
                "      </p>" +
                "    </div>" +
                "    <p style='color: #94a3b8; font-size: 13px; text-align: center; margin: 0;'>" +
                "      Si no podés asistir, por favor avisá con anticipación para liberar el turno." +
                "    </p>" +
                "  </div>" +
                "  <div style='background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;'>" +
                "    <p style='font-size: 11px; color: #94a3b8; margin: 0;'>© 2026 MediCore · Gestión Clínica de Vanguardia</p>" +
                "    <p style='font-size: 11px; color: #94a3b8; margin: 4px 0 0;'>Este recordatorio fue enviado automáticamente por tu médico.</p>" +
                "  </div>" +
                "</div>";

            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Error al enviar recordatorio de turno a " + to + ": " + e.getMessage());
            throw new RuntimeException("Error enviando recordatorio", e);
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}