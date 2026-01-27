package com.hirespherex.service;

import com.hirespherex.dto.AuthDtos;
import com.hirespherex.entity.User;

public interface AuthService {
    User register(AuthDtos.RegisterRequest request);
    String login(AuthDtos.LoginRequest request);
    String refresh(String refreshToken);
    AuthDtos.ProfileResponse currentUserProfile(String email);
}
