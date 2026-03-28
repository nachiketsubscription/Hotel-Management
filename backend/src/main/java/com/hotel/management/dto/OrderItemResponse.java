package com.hotel.management.dto;

public class OrderItemResponse {

    private Long menuItemId;
    private String menuItemName;
    private int quantity;
    private double lineTotal;

    public OrderItemResponse(Long menuItemId, String menuItemName, int quantity, double lineTotal) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getLineTotal() {
        return lineTotal;
    }
}
