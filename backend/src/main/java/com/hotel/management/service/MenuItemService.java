package com.hotel.management.service;

import com.hotel.management.dto.MenuItemRequest;
import com.hotel.management.model.MenuItem;
import com.hotel.management.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrueOrderByCategoryAscNameAsc();
    }

    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuItem menuItem = new MenuItem(
                request.getName().trim(),
                request.getCategory().trim(),
                request.getDescription().trim(),
                request.getFoodType().trim(),
                request.getPrice(),
                request.isAvailable()
        );

        return menuItemRepository.save(menuItem);
    }

    @Override
    public void run(String... args) {
        if (menuItemRepository.count() > 0) {
            return;
        }

        List<MenuItem> sampleMenu = List.of(
                new MenuItem("Masala Dosa", "Breakfast", "Crispy dosa with spiced potato filling and chutneys.", "Veg", 120.0, true),
                new MenuItem("Veg Sandwich", "Breakfast", "Grilled sandwich with vegetables, cheese, and mint sauce.", "Veg", 95.0, true),
                new MenuItem("Tomato Soup", "Starters", "Smooth tomato soup finished with cream and herbs.", "Veg", 110.0, true),
                new MenuItem("Paneer Tikka", "Starters", "Char-grilled cottage cheese cubes with spices.", "Veg", 220.0, true),
                new MenuItem("Butter Chicken", "Main Course", "Rich tomato-based curry served with soft chicken pieces.", "Non-Veg", 340.0, true),
                new MenuItem("Veg Biryani", "Main Course", "Fragrant basmati rice cooked with vegetables and spices.", "Veg", 260.0, true),
                new MenuItem("Jeera Rice", "Main Course", "Steamed rice tempered with cumin.", "Veg", 130.0, true),
                new MenuItem("Gulab Jamun", "Desserts", "Warm milk-solid dumplings in sugar syrup.", "Veg", 90.0, true),
                new MenuItem("Fresh Lime Soda", "Beverages", "Sweet and salted soda with fresh lime.", "Veg", 80.0, true)
        );

        menuItemRepository.saveAll(sampleMenu);
    }
}
