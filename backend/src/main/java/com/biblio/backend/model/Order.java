package com.biblio.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNumber; // Format: BIB-YYYYMMDD-XXXXX

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.CREEE;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private BigDecimal totalAmountHT;

    @Column(nullable = false)
    private BigDecimal totalAmountTTC;

    @Column(nullable = false)
    private BigDecimal shippingFee;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name="fullName", column=@Column(name="shipping_full_name")),
            @AttributeOverride(name="street", column=@Column(name="shipping_street")),
            @AttributeOverride(name="city", column=@Column(name="shipping_city")),
            @AttributeOverride(name="zipCode", column=@Column(name="shipping_zip_code")),
            @AttributeOverride(name="country", column=@Column(name="shipping_country"))
    })
    private Address shippingAddress;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name="fullName", column=@Column(name="billing_full_name")),
            @AttributeOverride(name="street", column=@Column(name="billing_street")),
            @AttributeOverride(name="city", column=@Column(name="billing_city")),
            @AttributeOverride(name="zipCode", column=@Column(name="billing_zip_code")),
            @AttributeOverride(name="country", column=@Column(name="billing_country"))
    })
    private Address billingAddress;

    private String cmiTransactionId;

    // Added field to handle Cash on Delivery vs CMI
    private String paymentMethod;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
