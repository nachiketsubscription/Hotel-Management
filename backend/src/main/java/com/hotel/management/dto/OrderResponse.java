package com.hotel.management.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private String orderId;
    private String customerName;
    private String tableNumber;
    private String status;
    private double totalAmount;
    private double amountPaid;
    private String specialInstructions;
    private LocalDateTime orderedAt;
    private List<OrderItemResponse> items;

    public OrderResponse(String orderId,
                         String customerName,
                         String tableNumber,
                         String status,
                         double totalAmount,
                         double amountPaid,
                         String specialInstructions,
                         LocalDateTime orderedAt,
                         List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.tableNumber = tableNumber;
        this.status = status;
        this.totalAmount = totalAmount;
        this.amountPaid = amountPaid;
        this.specialInstructions = specialInstructions;
        this.orderedAt = orderedAt;
        this.items = items;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public String getStatus() {
        return status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public LocalDateTime getOrderedAt() {
        return orderedAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }
}
