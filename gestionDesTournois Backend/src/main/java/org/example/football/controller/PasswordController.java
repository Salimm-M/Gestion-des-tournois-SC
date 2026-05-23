package org.example.football.controller;


import org.example.football.dto.ChangePasswordRequest;
import org.example.football.dto.EmailDto;
import org.example.football.dto.UpdatePasswordRequest;
import org.example.football.service.PasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pass")
public class PasswordController {
   private final PasswordService passwordService;
   public PasswordController(PasswordService passwordService) {
       this.passwordService = passwordService;
   }
   @PostMapping("/send-code")
   public boolean sendCode(@RequestBody EmailDto emailDto){
       passwordService.sendConfirmationCode(emailDto.getEmail());
       return true;
   }
   @PostMapping("update-password")
    public boolean updatePassword(@RequestBody UpdatePasswordRequest request){
       return passwordService.updatePassword(request);
   }
    @PostMapping("/change-password")
    public boolean changePassword(@RequestBody ChangePasswordRequest request) {
        return passwordService.changePassword(request);
    }
}
