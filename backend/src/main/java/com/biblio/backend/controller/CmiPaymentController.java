package com.biblio.backend.controller;

import com.biblio.backend.model.Order;
import com.biblio.backend.model.OrderStatus;
import com.biblio.backend.repository.OrderRepository;
import com.biblio.backend.service.CmiService;
import com.biblio.backend.service.EmailService;
import com.biblio.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cmi")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CmiPaymentController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CmiService cmiService;

    @Autowired
    private EmailService emailService;

    @Value("${cmi.client-id}")
    private String clientId;

    @Value("${cmi.ok-url}")
    private String okUrl;

    @Value("${cmi.fail-url}")
    private String failUrl;

    @PostMapping("/generate-request/{orderId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> generateCmiRequest(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"CMI".equals(order.getPaymentMethod())) {
            return ResponseEntity.badRequest().body("Order is not set to CMI payment.");
        }

        Map<String, String> params = new HashMap<>();
        params.put("clientid", clientId);
        params.put("amount", order.getTotalAmountTTC().toString());
        params.put("oid", order.getId().toString());
        params.put("okUrl", okUrl);
        params.put("failUrl", failUrl);
        params.put("tranType", "PreAuth");
        params.put("currency", "504"); // MAD
        params.put("storetype", "3D_PAY_HOSTING");
        params.put("hashAlgorithm", "ver3");
        params.put("shopurl", "http://localhost:4200");
        params.put("lang", "fr");
        params.put("encoding", "UTF-8");
        
        if (order.getUser() != null) {
            params.put("email", order.getUser().getEmail());
        }

        String hash = cmiService.generateHash(params);
        params.put("hash", hash);

        return ResponseEntity.ok(params);
    }

    @PostMapping("/callback")
    public String handleCmiCallback(@RequestParam Map<String, String> allParams) {
        boolean isValid = cmiService.verifyHash(allParams);
        
        if (!isValid) {
            return "FAILURE";
        }

        String orderIdStr = allParams.get("oid");
        String procReturnCode = allParams.get("ProcReturnCode");
        String cmiTransactionId = allParams.get("TransId");

        if (orderIdStr != null && "00".equals(procReturnCode)) {
            Long orderId = Long.parseLong(orderIdStr);
            Order order = orderRepository.findById(orderId).orElse(null);
            
            if (order != null && order.getStatus() == OrderStatus.CREEE) {
                order.setCmiTransactionId(cmiTransactionId);
                orderService.updateOrderStatus(order, OrderStatus.PAYEE, "Paiement CMI reçu avec succès. TransId: " + cmiTransactionId);
                if (order.getUser() != null) {
                    emailService.sendOrderConfirmation(order.getUser().getEmail(), order.getOrderNumber());
                }
                return "ACTION=POSTAUTH";
            }
        }
        
        return "FAILURE";
    }
}
