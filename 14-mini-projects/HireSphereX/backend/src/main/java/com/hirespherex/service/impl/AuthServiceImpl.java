package com.hirespherex.service.impl;

import com.hirespherex.dto.AuthDtos;
import com.hirespherex.entity.Role;
import com.hirespherex.entity.User;
import com.hirespherex.repository.RoleRepository;
import com.hirespherex.repository.UserRepository;
import com.hirespherex.security.jwt.JwtService;
import com.hirespherex.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public User register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        Role candidateRole = roleRepository.findByName("CANDIDATE")
                .orElseGet(() -> roleRepository.save(Role.builder().name("CANDIDATE").build()));
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .build();
        user.getRoles().add(candidateRole);
        User saved = userRepository.save(user);
        log.info("Registered user {}", saved.getEmail());
        return saved;
    }

    @Override
    public String login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).toArray(String[]::new));
        return jwtService.generateAccessToken(user.getEmail(), claims);
    }

    @Override
    public String refresh(String refreshToken) {
        var claims = jwtService.parseToken(refreshToken);
        String tokenType = (String) claims.get("type");
        if (tokenType == null || !tokenType.equals("refresh")) {
            throw new RuntimeException("Invalid refresh token");
        }

        String subject = claims.getSubject();
        User user = userRepository.findByEmail(subject)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> accessClaims = new HashMap<>();
        accessClaims.put("roles", user.getRoles().stream().map(Role::getName).toArray(String[]::new));
        accessClaims.put("type", "access");

        return jwtService.generateAccessToken(subject, accessClaims);
    }

    @Override
    public AuthDtos.ProfileResponse currentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuthDtos.ProfileResponse profile = new AuthDtos.ProfileResponse();
        profile.setEmail(user.getEmail());
        profile.setFullName(user.getFullName());
        profile.setRoles(user.getRoles().stream().map(Role::getName).toArray(String[]::new));
        return profile;
    }
}
