package org.example.football.service;



import lombok.RequiredArgsConstructor;
import org.example.football.Enum.Role;
import org.example.football.config.JwtUtil;
import org.example.football.dto.LoginRequest;
import org.example.football.dto.LoginResponse;
import org.example.football.dto.UserDto;
import org.example.football.entites.User;
import org.example.football.mapper.UserMapper;
import org.example.football.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;


    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.Responsable);
        return userRepository.save(user);
    }
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        UserDto userDto = userMapper.mapToDto(user);
        return new LoginResponse(userDto, token);
    }

}

