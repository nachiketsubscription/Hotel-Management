package com.hotel.management.service;

import com.hotel.management.dto.BusinessSummaryResponse;
import com.hotel.management.dto.OrderItemRequest;
import com.hotel.management.dto.OrderItemResponse;
import com.hotel.management.dto.OrderRequest;
import com.hotel.management.dto.OrderResponse;
import com.hotel.management.model.CustomerOrder;
import com.hotel.management.model.MenuItem;
import com.hotel.management.model.OrderItem;
import com.hotel.management.repository.CustomerOrderRepository;
import com.hotel.management.repository.MenuItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final DateTimeFormatter ORDER_DATE_FORMATTER = DateTimeFormatter.ofPattern("ddMMyyyy");

    private final CustomerOrderRepository customerOrderRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderService(CustomerOrderRepository customerOrderRepository, MenuItemRepository menuItemRepository) {
        this.customerOrderRepository = customerOrderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        LocalDateTime orderedAt = LocalDateTime.now();
        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.getCustomerName().trim());
        order.setOrderNumber(generateOrderNumber(orderedAt.toLocalDate()));
        order.setTableNumber(request.getTableNumber().trim());
        order.setStatus("Ordered");
        order.setSpecialInstructions(request.getSpecialInstructions());
        order.setOrderedAt(orderedAt);

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemResponse> responseItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .filter(MenuItem::isAvailable)
                    .orElseThrow(() -> new EntityNotFoundException("Menu item not found: " + itemRequest.getMenuItemId()));

            double lineTotal = menuItem.getPrice() * itemRequest.getQuantity();
            totalAmount += lineTotal;

            OrderItem orderItem = new OrderItem();
            orderItem.setCustomerOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setLineTotal(lineTotal);
            orderItems.add(orderItem);

            responseItems.add(new OrderItemResponse(
                    menuItem.getId(),
                    menuItem.getName(),
                    itemRequest.getQuantity(),
                    lineTotal
            ));
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setAmountPaid(0.0);

        CustomerOrder savedOrder = customerOrderRepository.save(order);

        return toOrderResponse(savedOrder, responseItems);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrderHistory() {
        return customerOrderRepository.findAllByOrderByOrderedAtDesc()
                .stream()
                .map(order -> toOrderResponse(
                        order,
                        order.getItems().stream()
                                .map(item -> new OrderItemResponse(
                                        item.getMenuItem().getId(),
                                        item.getMenuItem().getName(),
                                        item.getQuantity(),
                                        item.getLineTotal()
                                ))
                                .toList()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public BusinessSummaryResponse getBusinessSummary(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();

        List<CustomerOrder> todaysOrders = customerOrderRepository
                .findAllByOrderedAtBetweenOrderByOrderedAtDesc(todayStart, tomorrowStart);

        LocalDateTime rangeStart = startDate.atStartOfDay();
        LocalDateTime rangeEndExclusive = endDate.plusDays(1).atStartOfDay();

        List<CustomerOrder> rangeOrders = customerOrderRepository
                .findAllByOrderedAtBetweenOrderByOrderedAtDesc(rangeStart, rangeEndExclusive);

        double todayTotalAmount = todaysOrders.stream()
                .mapToDouble(this::getBusinessAmount)
                .sum();

        double dateRangeTotalAmount = rangeOrders.stream()
                .mapToDouble(this::getBusinessAmount)
                .sum();

        long completedOrderCount = rangeOrders.stream()
                .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                .count();

        double completedAmount = rangeOrders.stream()
                .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                .mapToDouble(this::getBusinessAmount)
                .sum();

        long pendingOrderCount = rangeOrders.stream()
                .filter(order -> !"Completed".equalsIgnoreCase(order.getStatus()))
                .count();

        return new BusinessSummaryResponse(
                startDate.toString(),
                endDate.toString(),
                todaysOrders.size(),
                todayTotalAmount,
                rangeOrders.size(),
                dateRangeTotalAmount,
                completedOrderCount,
                completedAmount,
                pendingOrderCount
        );
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderNumber, String status, Double amountPaid) {
        CustomerOrder order = customerOrderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderNumber));

        order.setStatus(status);
        if (amountPaid != null) {
            order.setAmountPaid(amountPaid);
        }

        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getMenuItem().getId(),
                        item.getMenuItem().getName(),
                        item.getQuantity(),
                        item.getLineTotal()
                ))
                .toList();

        return toOrderResponse(order, items);
    }

    private String generateOrderNumber(LocalDate orderDate) {
        LocalDateTime startOfDay = orderDate.atStartOfDay();
        LocalDateTime endOfDay = orderDate.plusDays(1).atStartOfDay();
        long sequence = customerOrderRepository.countByOrderedAtBetween(startOfDay, endOfDay) + 1;

        return orderDate.format(ORDER_DATE_FORMATTER) + "-" + String.format("%03d", sequence);
    }

    private double getBusinessAmount(CustomerOrder order) {
        return order.getAmountPaid() > 0 ? order.getAmountPaid() : order.getTotalAmount();
    }

    private OrderResponse toOrderResponse(CustomerOrder order, List<OrderItemResponse> items) {
        return new OrderResponse(
                order.getOrderNumber(),
                order.getCustomerName(),
                order.getTableNumber(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getAmountPaid(),
                order.getSpecialInstructions(),
                order.getOrderedAt(),
                items
        );
    }
}
