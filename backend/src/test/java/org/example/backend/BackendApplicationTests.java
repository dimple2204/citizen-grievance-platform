package org.example.backend;

import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testGetAdminAnalytics() throws Exception {
        User admin = userRepository.findByEmail("admin@lokshikayat.gov.in").orElse(null);
        if (admin == null) {
            System.out.println("admin user not found!");
            return;
        }

        String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole().name());

        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + token))
                .andDo(print());
    }
}
