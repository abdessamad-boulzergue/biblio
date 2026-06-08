package com.biblio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class CmiService {

    @Value("${cmi.store-key}")
    private String storeKey;

    public String generateHash(Map<String, String> parameters) {
        try {
            List<String> keys = new ArrayList<>(parameters.keySet());
            Collections.sort(keys);

            StringBuilder sb = new StringBuilder();
            for (String key : keys) {
                if ("hash".equalsIgnoreCase(key) || "encoding".equalsIgnoreCase(key)) {
                    continue;
                }
                String value = parameters.get(key);
                if (value != null) {
                    value = value.replace("\\", "\\\\").replace("|", "\\|");
                    sb.append(value);
                }
                sb.append("|");
            }
            sb.append(storeKey.replace("\\", "\\\\").replace("|", "\\|"));

            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] bytes = md.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
            
            return Base64.getEncoder().encodeToString(bytes);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating CMI hash", e);
        }
    }

    public boolean verifyHash(Map<String, String> callbackParams) {
        // Find hash regardless of case
        String receivedHash = null;
        for (String key : callbackParams.keySet()) {
            if ("hash".equalsIgnoreCase(key)) {
                receivedHash = callbackParams.get(key);
                break;
            }
        }
        
        if (receivedHash == null) {
            return false;
        }
        
        String generatedHash = generateHash(callbackParams);
        return receivedHash.equals(generatedHash);
    }
}
