package com.groupware.approval.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    private final ConcurrentHashMap<String, Integer> tokenStorage = new ConcurrentHashMap<>();

    public String generateToken(int approvalId) {
        String uuid = UUID.randomUUID().toString();
        String salt = "groupware";
        String saltedToken = salt + uuid;
        String hashedToken = hashToken(saltedToken);
        String shortToken = hashedToken.substring(0, 8);
        tokenStorage.put(shortToken, approvalId);
        return shortToken;
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public Integer getApprovalIdFromToken(String token) {
        return tokenStorage.get(token);
    }
}
