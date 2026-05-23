package org.example.football.controller;

import lombok.RequiredArgsConstructor;
import org.example.football.dto.CreateUserDto;
import org.example.football.dto.UserDto;
import org.example.football.repository.UserRepository;
import org.example.football.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<UserDto> saveUser(@RequestBody CreateUserDto userDto) {
        return  ResponseEntity.ok(userService.saveUser(userDto));
    }
 @PatchMapping
    public ResponseEntity<UserDto> updateUser(@RequestBody CreateUserDto userDto) {
        return ResponseEntity.ok(userService.patchUser(userDto));
    }
    @DeleteMapping
    public void deleteUser(@RequestBody Long idUser) {
        userService.delete(idUser);
    }
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }
}







