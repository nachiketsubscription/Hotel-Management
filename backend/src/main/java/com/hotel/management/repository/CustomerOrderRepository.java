package com.hotel.management.repository;

import com.hotel.management.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    long countByOrderedAtBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<CustomerOrder> findAllByOrderByOrderedAtDesc();

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    List<CustomerOrder> findAllByOrderedAtBetweenOrderByOrderedAtDesc(LocalDateTime startDateTime, LocalDateTime endDateTime);
}
