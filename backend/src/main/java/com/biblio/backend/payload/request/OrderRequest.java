package com.biblio.backend.payload.request;

import com.biblio.backend.model.Address;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Address shippingAddress;
    private Address billingAddress;
    private String paymentMethod; // CMI or COD
    private List<OrderItemRequest> items;
}
