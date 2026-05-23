package org.example.football.config;

import lombok.RequiredArgsConstructor;
import org.example.football.Enum.Role;
import org.example.football.entites.Admin;
import org.example.football.entites.Responsable;
import org.example.football.entites.User;
import org.example.football.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {


        if (userRepository.count() == 0) {

            User admin = new Admin();
            admin.setNom("Admin");
            admin.setPrenom("System");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.Admin);

            userRepository.save(admin);

          
            User user = new Responsable();
            user.setNom("User");
            user.setPrenom("Test");
            user.setEmail("user@gmail.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.Responsable);

            userRepository.save(user);
        }
    }
}