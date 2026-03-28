import { BrowserRouter, Route, Routes } from "react-router-dom";
import BillPage from "./components/BillPage";
import BusinessPage from "./components/BusinessPage";
import CustomerOrderPage from "./components/CustomerOrderPage";
import HomePage from "./components/HomePage";
import MenuCreationPage from "./components/MenuCreationPage";
import MenuPage from "./components/MenuPage";
import OrderDetailsPage from "./components/OrderDetailsPage";
import OrderHistoryPage from "./components/OrderHistoryPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<BusinessPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu-creation" element={<MenuCreationPage />} />
        <Route path="/customer-order" element={<CustomerOrderPage />} />
        <Route path="/order-details" element={<OrderDetailsPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/bill" element={<BillPage />} />
      </Routes>
    </BrowserRouter>
  );
}
