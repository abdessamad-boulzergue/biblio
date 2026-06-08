package com.biblio.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private BigDecimal priceHT;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private BigDecimal taxRate; // e.g., 20.0 for 20%

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer stockQuantity;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String sku; // Référence SKU

    private Double weight; // en kg
    private String dimensions; // L x l x H

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ArticleStatus status = ArticleStatus.ACTIF;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @ToString.Exclude
    private Category category;

    @ElementCollection
    @CollectionTable(name = "article_images", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(name = "main_image_url")
    private String mainImage;

    @Transient
    public BigDecimal getPriceTTC() {
        if (priceHT == null || taxRate == null) return BigDecimal.ZERO;
        BigDecimal taxMultiplier = BigDecimal.ONE.add(taxRate.divide(BigDecimal.valueOf(100)));
        return priceHT.multiply(taxMultiplier);
    }
}
