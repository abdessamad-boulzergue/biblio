package com.biblio.backend.controller;

import com.biblio.backend.model.Order;
import com.biblio.backend.model.OrderStatus;
import com.biblio.backend.model.User;
import com.biblio.backend.payload.request.OrderRequest;
import com.biblio.backend.repository.OrderRepository;
import com.biblio.backend.repository.UserRepository;
import com.biblio.backend.security.services.UserDetailsImpl;
import com.biblio.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(orderRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        orderService.updateOrderStatus(order, status, "Statut mis à jour par l'administrateur");
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> requestReturn(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Non autorisé à demander un retour pour cette commande");
        }

        if (order.getStatus() != OrderStatus.LIVREE) {
            return ResponseEntity.badRequest().body("Seules les commandes livrées peuvent être retournées");
        }

        orderService.updateOrderStatus(order, OrderStatus.RETOUR_DEMANDE, "Le client a demandé un retour");
        return ResponseEntity.ok(order);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        try {
            Order order = orderService.createOrder(request, user);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
