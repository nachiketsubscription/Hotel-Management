package com.hotel.management.controller;

import com.hotel.management.dto.BusinessSummaryResponse;
import com.hotel.management.dto.OrderRequest;
import com.hotel.management.dto.OrderResponse;
import com.hotel.management.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getOrderHistory() {
        return orderService.getOrderHistory();
    }

    @GetMapping("/business-summary")
    public BusinessSummaryResponse getBusinessSummary(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return orderService.getBusinessSummary(startDate, endDate);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(@Valid @RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }

    @PutMapping("/{orderNumber}/status")
    public OrderResponse updateOrderStatus(@PathVariable String orderNumber,
                                          @RequestParam String status,
                                          @RequestParam(required = false) Double amountPaid) {
        return orderService.updateOrderStatus(orderNumber, status, amountPaid);
    }
}
