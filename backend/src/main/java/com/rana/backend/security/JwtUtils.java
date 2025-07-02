package com.rana.backend.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date; 

@Slf4j
@Component
public class JwtUtils {

    // injecting the secret key from application.properties 
    // which will be used for signing and validating JWTs
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    // injecting the JWT expiration time in milliseconds from application.properties
    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // generating a JWT token based on the user's email
    public String generateJwtToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }
    // returns a cryptographic key object for signing JWTs
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }


    // parsing a JWT token to extract the subject (email) from it
    public String getEmailFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
        String email = claims.getSubject();
        return email;
    }


    // validates a JWT token to ensure it is properly formed, signed, and not expired
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true; 
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
