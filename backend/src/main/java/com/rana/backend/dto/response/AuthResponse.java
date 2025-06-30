package com.rana.backend.dto.response;

public record AuthResponse(
        String token,
        String email) {
}