package com.biblio.backend.service;

import com.biblio.backend.model.*;
import com.biblio.backend.payload.request.OrderRequest;
import com.biblio.backend.payload.request.OrderItemRequest;
import com.biblio.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    @Transactional
    public Order createOrder(OrderRequest request, User user) {
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setShippingAddress(request.getShippingAddress());
        order.setBillingAddress(request.getBillingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.CREEE);

        BigDecimal totalHT = BigDecimal.ZERO;
        BigDecimal totalTTC = BigDecimal.ZERO;
        double totalWeight = 0.0;

        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Article article = articleRepository.findById(itemReq.getArticleId())
                    .orElseThrow(() -> new RuntimeException("Article not found"));

            if (article.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Not enough stock for article " + article.getTitle());
            }

            article.setStockQuantity(article.getStockQuantity() - itemReq.getQuantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setArticle(article);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPriceHT(article.getPriceHT());
            item.setTaxRate(article.getTaxRate());
            
            items.add(item);

            BigDecimal itemTotalHT = article.getPriceHT().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemTotalTTC = article.getPriceTTC().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            
            totalHT = totalHT.add(itemTotalHT);
            totalTTC = totalTTC.add(itemTotalTTC);
            if(article.getWeight() != null) {
                totalWeight += article.getWeight() * itemReq.getQuantity();
            }
        }
        
        order.setItems(items);
        order.setTotalAmountHT(totalHT);
        
        BigDecimal shipping = calculateShipping(totalWeight, request.getShippingAddress().getCountry());
        order.setShippingFee(shipping);
        order.setTotalAmountTTC(totalTTC.add(shipping));

        Order savedOrder = orderRepository.save(order);
        recordHistory(savedOrder, null, OrderStatus.CREEE, "Commande créée via le site internet.");
        return savedOrder;
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return "BIB-" + datePart + "-" + randomPart;
    }

    private BigDecimal calculateShipping(double weightKg, String country) {
        if (country == null || country.isEmpty()) return BigDecimal.ZERO;
        if ("France".equalsIgnoreCase(country)) {
            if (weightKg < 1.0) return new BigDecimal("4.99");
            if (weightKg < 5.0) return new BigDecimal("8.99");
            return new BigDecimal("14.99");
        } else {
            return new BigDecimal("19.99");
        }
    }

    @Transactional
    public void updateOrderStatus(Order order, OrderStatus newStatus, String comment) {
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);
        orderRepository.save(order);
        recordHistory(order, oldStatus, newStatus, comment);
    }
    
    private void recordHistory(Order order, OrderStatus oldStatus, OrderStatus newStatus, String comment) {
        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setComment(comment);
        orderHistoryRepository.save(history);
    }
}
