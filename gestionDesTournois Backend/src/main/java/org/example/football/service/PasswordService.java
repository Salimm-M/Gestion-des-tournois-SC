package org.example.football.service;



import org.example.football.dto.ChangePasswordRequest;
import org.example.football.dto.UpdatePasswordRequest;
import org.example.football.entites.User;
import org.example.football.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class PasswordService {
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public PasswordService(UserRepository userRepository, JavaMailSender mail, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mailSender = mail;
        this.passwordEncoder = passwordEncoder;
    }
    public void sendConfirmationCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("user non trouvé");
        User user = userOpt.get();
        String code = String.valueOf(new Random().nextInt(899999) + 100000);
        user.setConfirmCode(code);
        userRepository.save(user);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Confirmation code");
        message.setText("code est: " + code);
        mailSender.send(message);
    }

    public boolean updatePassword(UpdatePasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) throw new RuntimeException("User non trouvé");
        User user = userOpt.get();
        if (user.getConfirmCode().equals(request.getConfirmCode())) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setConfirmCode(null);
            userRepository.save(user);
            return true;
        } else {
            throw new RuntimeException("Code de confirmation invalid ");
        }
    }
    public boolean changePassword(ChangePasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User non trouvé");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Confirmation mot de passe incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return true;
    }
}
