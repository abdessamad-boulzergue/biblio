package com.biblio.backend.controller;

import com.biblio.backend.model.Article;
import com.biblio.backend.model.Category;
import com.biblio.backend.repository.ArticleRepository;
import com.biblio.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    public Page<Article> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort[0]).descending());
        return articleRepository.findAll(pageable);
    }

    @GetMapping("/search")
    public Page<Article> searchArticles(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return articleRepository.findByTitleContainingIgnoreCaseOrShortDescriptionContainingIgnoreCase(query, query, pageable);
    }

    @GetMapping("/category/{categoryId}")
    public Page<Article> getArticlesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return articleRepository.findByCategoryId(categoryId, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> article = articleRepository.findById(id);
        return article.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Article createArticle(@RequestBody Article article) {
        if (article.getCategory() != null && article.getCategory().getId() != null) {
            Category category = categoryRepository.findById(article.getCategory().getId()).orElse(null);
            article.setCategory(category);
        }
        return articleRepository.save(article);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article articleDetails) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        article.setTitle(articleDetails.getTitle());
        article.setShortDescription(articleDetails.getShortDescription());
        article.setLongDescription(articleDetails.getLongDescription());
        article.setPriceHT(articleDetails.getPriceHT());
        article.setTaxRate(articleDetails.getTaxRate());
        article.setStockQuantity(articleDetails.getStockQuantity());
        article.setSku(articleDetails.getSku());
        article.setWeight(articleDetails.getWeight());
        article.setDimensions(articleDetails.getDimensions());
        article.setStatus(articleDetails.getStatus());
        article.setMainImage(articleDetails.getMainImage());
        article.setImages(articleDetails.getImages());

        if (articleDetails.getCategory() != null && articleDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(articleDetails.getCategory().getId()).orElse(null);
            article.setCategory(category);
        }

        return ResponseEntity.ok(articleRepository.save(article));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
