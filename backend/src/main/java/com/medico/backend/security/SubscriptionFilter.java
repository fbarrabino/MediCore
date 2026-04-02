package com.medico.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medico.backend.model.Usuario;
import com.medico.backend.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class SubscriptionFilter extends OncePerRequestFilter {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Solo interceptamos peticiones que no sean GET (como POST, PUT, DELETE, PATCH)
        String method = request.getMethod();
        if ("GET".equalsIgnoreCase(method) || "OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Interceptamos rutas clínicas o de negocio (evitamos /api/auth, /api/test)
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth") || path.startsWith("/api/test") || path.startsWith("/api/admin")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            String username = authentication.getName();
            Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();

                // Reglas explícitas dictadas para el SaaS:
                // Si su plan es "PRUEBA" y la fecha expiró, se deniega la petición.
                LocalDate hoy = LocalDate.now();
                
                // SuperAdmin núnca será bloqueado
                if (usuario.isSuperAdmin()) {
                    filterChain.doFilter(request, response);
                    return;
                }

                if (usuario.getPlanActual() == Usuario.PlanSuscripcion.PRUEBA) {
                    if (usuario.getFechaFinSuscripcion() != null && hoy.isAfter(usuario.getFechaFinSuscripcion())) {
                        enviarErrorSuscripcion(response, "Período de prueba finalizado. Por favor adquiera un plan.");
                        return;
                    }
                } else {
                    // Si pagó, pero se le cortó el acceso
                    if ("VENCIDO".equals(usuario.getEstadoPago()) || 
                       (usuario.getFechaFinSuscripcion() != null && hoy.isAfter(usuario.getFechaFinSuscripcion()))) {
                        enviarErrorSuscripcion(response, "Tu plan actual está vencido. Por favor regulariza tu pago.");
                        return;
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private void enviarErrorSuscripcion(HttpServletResponse response, String mensaje) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, String> errorData = new HashMap<>();
        errorData.put("error", mensaje);
        errorData.put("code", "SUBSCRIPTION_REQUIRED");

        response.getWriter().write(objectMapper.writeValueAsString(errorData));
        response.getWriter().flush();
    }
}
