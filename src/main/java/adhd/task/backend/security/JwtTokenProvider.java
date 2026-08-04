package adhd.task.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private long jwtExpirationMs; // 900000ms = 15 min

    @Value("${app.jwtRefreshExpirationMs}")
    private long jwtRefreshExpirationMs; // 604800000ms = 7 dias

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Gera Access Token (curta duração)
     */
    public String generateAccessToken(UUID userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(userId.toString()) // sub = user ID
                .claim("email", email)
                .claim("type", "access")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Gera Refresh Token (longa duração)
     */
    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationMs);

        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("type", "refresh")
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extrai User ID do token
     */
    public UUID getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return UUID.fromString(claims.getSubject());
    }

    /**
     * Extrai Email do token
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("email", String.class);
    }

    /**
     * Valida se o token é válido
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException ex) {
            log.error("Token inválido - erro de segurança: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Token malformado: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Token expirado: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Token não suportado: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("Claims string vazio: {}", ex.getMessage());
        }
        return false;
    }

    /**
     * Verifica se token está expirado
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException ex) {
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    /**
     * Retorna tempo de expiração em segundos
     */
    public Long getExpirationTimeInSeconds() {
        return jwtExpirationMs / 1000;
    }
}