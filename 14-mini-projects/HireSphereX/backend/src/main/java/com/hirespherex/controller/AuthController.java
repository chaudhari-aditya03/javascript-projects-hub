package com.hirespherex.controller;

import com.hirespherex.dto.AuthDtos;
import com.hirespherex.entity.User;
import com.hirespherex.security.jwt.JwtService;
import com.hirespherex.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid AuthDtos.RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.TokenResponse> login(@RequestBody @Valid AuthDtos.LoginRequest request) {
        String access = authService.login(request);
        String refresh = jwtService.generateRefreshToken(request.getEmail());
        AuthDtos.TokenResponse resp = new AuthDtos.TokenResponse();
        resp.setAccessToken(access);
        resp.setRefreshToken(refresh);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDtos.TokenResponse> refresh(@RequestBody @Valid AuthDtos.RefreshRequest request) {
        String subject = jwtService.parseToken(request.getRefreshToken()).getSubject();
        String access = authService.refresh(request.getRefreshToken());
        String refresh = jwtService.generateRefreshToken(subject);
        AuthDtos.TokenResponse resp = new AuthDtos.TokenResponse();
        resp.setAccessToken(access);
        resp.setRefreshToken(refresh);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDtos.ProfileResponse> me(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(authService.currentUserProfile(email));
    }
}
