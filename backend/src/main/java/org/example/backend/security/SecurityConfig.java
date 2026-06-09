package org.example.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF and enable CORS so React can talk to us
                .cors(cors -> {}).csrf(AbstractHttpConfigurer::disable)

                // 2. Set the rules for the endpoints
                .authorizeHttpRequests(auth -> auth
                        // OPEN DOORS: Anyone can register or login
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()

                        // ADMIN ONLY: System administration and analytics
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // CITIZENS: Access to citizen complaints
                        .requestMatchers("/api/complaints/citizen/**").hasAnyRole("CITIZEN", "ADMIN")

                        // OFFICERS: Access to department complaints
                        .requestMatchers("/api/complaints/department/**").hasAnyRole("OFFICER", "ADMIN")

                        // LOCKED DOORS: Everything else requires a valid token
                        .anyRequest().authenticated()
                )

                // 3. Tell Spring we are using JWTs, so don't create stateful server sessions
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Insert our custom JWT guard BEFORE the standard Spring Security guard
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Required Bean for password hashing (BCrypt is the industry standard)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Required Bean for handling the actual login authentication process
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
