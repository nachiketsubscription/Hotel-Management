package com.hotel.management.controller;

import com.hotel.management.dto.MenuItemRequest;
import com.hotel.management.model.MenuItem;
import com.hotel.management.service.MenuItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuItemService menuItemService;

    public MenuController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public List<MenuItem> getMenuItems() {
        return menuItemService.getAvailableMenuItems();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItem createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        return menuItemService.createMenuItem(request);
    }
}
