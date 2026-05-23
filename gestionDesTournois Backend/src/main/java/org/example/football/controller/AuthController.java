package org.example.football.controller;



import lombok.RequiredArgsConstructor;
import org.example.football.Enum.Role;
import org.example.football.dto.CreateUserDto;
import org.example.football.dto.LoginRequest;
import org.example.football.dto.LoginResponse;
import org.example.football.dto.UserDto;
import org.example.football.entites.User;
import org.example.football.mapper.UserMapper;
import org.example.football.repository.UserRepository;
import org.example.football.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @PostMapping("/register-first-admin")
    public ResponseEntity<UserDto> registerFirstAdmin(@RequestBody User user) {
        boolean hasAdmin = userRepository.existsByRole(Role.Admin);
        if (hasAdmin) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.Admin);
        User saved = userRepository.save(user);

        UserDto dto = userMapper.mapToDto(saved);
        return ResponseEntity.ok(dto);
    }



    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = authService.register(user);
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return this.authService.login(request);
    }

}

