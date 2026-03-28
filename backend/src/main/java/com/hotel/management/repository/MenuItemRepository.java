package com.hotel.management.repository;

import com.hotel.management.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByAvailableTrueOrderByCategoryAscNameAsc();
}
