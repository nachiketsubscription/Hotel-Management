import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuCard from "./MenuCard";

const API_BASE_URL = "http://localhost:8080/api";
const FOOD_TYPE_OPTIONS = ["All", "Veg", "Non-Veg"];
const NON_VEG_KEYWORDS = ["chicken", "mutton", "fish", "prawn", "egg"];

const initialForm = {
  customerName: "",
  tableNumber: "",
  specialInstructions: ""
};

export default function CustomerOrderPage() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [formData, setFormData] = useState(initialForm);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFoodType, setSelectedFoodType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) {
          throw new Error("Unable to load menu items.");
        }

        const data = await response.json();
        setMenu(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(menu.map((item) => item.category))];
  }, [menu]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return menu.filter((item) => {
      const itemText = `${item.name} ${item.description}`.toLowerCase();
      const normalizedFoodType = item.foodType?.trim().toLowerCase();
      const isNonVeg =
        normalizedFoodType === "non-veg" ||
        (normalizedFoodType !== "veg" &&
          NON_VEG_KEYWORDS.some((keyword) => itemText.includes(keyword)));
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesFoodType =
        selectedFoodType === "All" ||
        (selectedFoodType === "Veg" && !isNonVeg) ||
        (selectedFoodType === "Non-Veg" && isNonVeg);

      const matchesSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesFoodType && matchesSearch;
    });
  }, [menu, searchQuery, selectedCategory, selectedFoodType]);

  const cartItems = useMemo(() => {
    return menu
      .filter((item) => Number(quantities[item.id] || 0) > 0)
      .map((item) => ({
        ...item,
        quantity: Number(quantities[item.id]),
        lineTotal: Number(quantities[item.id]) * item.price
      }));
  }, [menu, quantities]);

  const grandTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [cartItems]);

  function handleQuantityChange(itemId, value) {
    const numericValue = Math.max(0, Number(value) || 0);
    setQuantities((current) => ({
      ...current,
      [itemId]: numericValue
    }));
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Please add at least one menu item before placing the order.");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order submission failed.");
      }

      setFormData(initialForm);
      setQuantities({});
      navigate("/order-details", {
        state: {
          order: data
        }
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <header className="sub-hero">
        <div>
          <p className="hero__eyebrow">Customer Order</p>
          <h1>Place a room service order.</h1>
          <p className="hero__copy">
            Select dishes, enter customer details, and submit the order from
            this page.
          </p>
        </div>
        <div className="sub-hero__actions">
          <Link to="/" className="ghost-button">
            Home
          </Link>
          <Link to="/menu" className="ghost-button">
            View Menu
          </Link>
          <Link to="/order-history" className="ghost-button">
            Order Details
          </Link>
        </div>
      </header>

      <main className="content-grid">
        <section className="menu-section">
          <div className="section-heading">
            <h2>Select Items</h2>
            <div className="category-pills">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === selectedCategory ? "active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search menu by item name, category, or description"
            />
          </div>

          <div className="food-type-pills" aria-label="Filter menu by food type">
            {FOOD_TYPE_OPTIONS.map((foodType) => (
              <button
                key={foodType}
                type="button"
                className={[
                  foodType === selectedFoodType ? "active" : "",
                  foodType === "Veg" ? "food-type-pills__veg" : "",
                  foodType === "Non-Veg" ? "food-type-pills__nonveg" : "",
                  foodType === "All" ? "food-type-pills__all" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedFoodType(foodType)}
              >
                {foodType}
              </button>
            ))}
          </div>

          {loading ? <p className="status-card">Loading menu...</p> : null}
          {!loading && error ? <p className="status-card error">{error}</p> : null}

          <div className="menu-grid">
            {visibleItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                quantity={quantities[item.id] || 0}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          {!loading && !error && visibleItems.length === 0 ? (
            <p className="status-card">No menu items match your search.</p>
          ) : null}
        </section>

        <aside className="order-section">
          <div className="section-heading">
            <h2>Order Form</h2>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <label>
              Customer Name
              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleFieldChange}
                placeholder="Enter customer name"
                required
              />
            </label>

            <label>
              Table Number
              <input
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleFieldChange}
                placeholder="Enter table number"
                required
              />
            </label>

            <label>
              Special Instructions
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleFieldChange}
                placeholder="Less spicy, no onion, extra plates..."
                rows="4"
              />
            </label>

            <div className="cart-summary">
              <h3>Selected Items</h3>
              {cartItems.length === 0 ? (
                <p className="empty-cart">No items selected yet.</p>
              ) : (
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <strong>Rs. {item.lineTotal.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>
              )}
              <div className="cart-summary__total">
                <span>Total</span>
                <strong>Rs. {grandTotal.toFixed(2)}</strong>
              </div>
            </div>

            {error ? <p className="form-message error">{error}</p> : null}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </aside>
      </main>
    </div>
  );
}
