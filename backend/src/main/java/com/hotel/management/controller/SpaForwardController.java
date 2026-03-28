package com.hotel.management.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/",
            "/menu",
            "/menu-creation",
            "/customer-order",
            "/order-details",
            "/order-history",
            "/bill",
            "/business"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
