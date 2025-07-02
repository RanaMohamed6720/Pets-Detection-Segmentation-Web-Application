package com.rana.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.rana.backend.security.JwtAuthEntryPoint;
import com.rana.backend.security.JwtAuthFilter;
import com.rana.backend.security.JwtUtils;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    // dependencies injection when creating SecurityConfig object
    public SecurityConfig(JwtAuthEntryPoint jwtAuthEntryPoint,JwtUtils jwtUtils,UserDetailsService userDetailsService) {
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    // defines a password encoder bean that Spring can use anywhere using BCrypt hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // bean for the authentication manager which handles
    // login/authentication logic
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtUtils, userDetailsService);
    }
   
    // core security configuration method that defines all security rules   
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // disabling CSRF (Cross-Site Request Forgery) protection because we're building a
                // stateless API
                .csrf(csrf -> csrf.disable())

                // Set a custom handler for unauthorized access (no/invalid JWT)
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(jwtAuthEntryPoint)) // sends 401 response if token is invalid or
                                                                      // missing

                // tells Spring not to use HTTP sessions at all (we use JWTs instead)
                .sessionManagement(management -> management
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // sets which URLs are public and which require login
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // allow public access to login/register endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()) // all other requests require valid JWT token
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}