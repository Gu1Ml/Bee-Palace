package adhd.task.backend.security;

import adhd.task.backend.config.JwtConfig;
import adhd.task.backend.exception.AuthException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtConfig jwtConfig;

    /**
     * Filtro executado uma vez por requisição
     * Extrai JWT do header Authorization, valida e seta no SecurityContext
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // Extrair token do header Authorization
            String token = extractTokenFromRequest(request);

            // Se token existe e é válido
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {

                // Extrair userId e email do token
                UUID userId = jwtTokenProvider.getUserIdFromToken(token);
                String email = jwtTokenProvider.getEmailFromToken(token);

                log.debug("Token válido para usuário: {}", email);

                // Criar Authentication object
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email,                      // principal (email)
                                null,                       // credentials (não usado em JWT)
                                Collections.emptyList()    // authorities (pode adicionar permissões depois)
                        );

                // Seta o contexto de segurança
                SecurityContextHolder.getContext().setAuthentication(auth);

                // Adicionar userId e email nos atributos da request (para usar nos controllers)
                request.setAttribute("userId", userId);
                request.setAttribute("userEmail", email);
                request.setAttribute("tokenIssuedAt", System.currentTimeMillis());

                log.debug("Autenticação setada para userId: {}", userId);
            } else if (StringUtils.hasText(token)) {
                // Token foi fornecido mas é inválido
                log.warn("Token inválido fornecido na requisição");
                sendUnauthorizedError(response, "Token inválido ou expirado");
                return;
            }
            // Se não tem token, continua sem autenticação (rotas públicas)

        } catch (AuthException ex) {
            log.error("Erro de autenticação: {}", ex.getMessage());
            sendUnauthorizedError(response, ex.getMessage());
            return;
        } catch (Exception ex) {
            log.error("Erro inesperado no filtro JWT: {}", ex.getMessage(), ex);
            sendUnauthorizedError(response, "Erro ao processar autenticação");
            return;
        }

        // Continuar com o próximo filtro
        filterChain.doFilter(request, response);
    }

    /**
     * Extrai Bearer token do header Authorization
     * Formato esperado: "Bearer {token}"
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(jwtConfig.getHeaderName()); // "Authorization"

        if (StringUtils.hasText(authHeader) &&
                authHeader.startsWith(jwtConfig.getTokenPrefix())) { // "Bearer "

            // Remove o prefixo "Bearer " e retorna apenas o token
            return authHeader.substring(jwtConfig.getTokenPrefix().length());
        }

        return null;
    }

    /**
     * Envia resposta de erro 401 Unauthorized em JSON
     */
    private void sendUnauthorizedError(HttpServletResponse response, String message)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("status", 401);
        errorBody.put("error", "Unauthorized");
        errorBody.put("message", message);
        errorBody.put("timestamp", LocalDateTime.now().format(
                DateTimeFormatter.ISO_DATE_TIME
        ));

        response.getWriter().write(new ObjectMapper().writeValueAsString(errorBody));
    }

    /**
     * Determinar se este filtro deve ser executado
     * Skipar para rotas públicas para performance
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Rotas públicas que não precisam de autenticação
        return path.startsWith("/api/v1/auth/register") ||
                path.startsWith("/api/v1/auth/login") ||
                path.startsWith("/api/v1/auth/refresh") ||
                path.startsWith("/actuator/health") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/v3/api-docs");
    }

}