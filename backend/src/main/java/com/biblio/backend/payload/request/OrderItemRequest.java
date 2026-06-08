package com.biblio.backend.payload.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long articleId;
    private Integer quantity;
}
