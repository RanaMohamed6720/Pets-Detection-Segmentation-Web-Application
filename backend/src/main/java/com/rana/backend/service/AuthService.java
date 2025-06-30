package com.rana.backend.service;

import com.rana.backend.dto.request.LoginRequest;
import com.rana.backend.dto.request.RegisterRequest;
import com.rana.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
}