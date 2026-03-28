import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MenuCard from "./MenuCard";

const API_BASE_URL = "http://localhost:8080/api";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
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
    if (selectedCategory === "All") {
      return menu;
    }

    return menu.filter((item) => item.category === selectedCategory);
  }, [menu, selectedCategory]);

  return (
    <div className="page-shell">
      <header className="sub-hero">
        <div>
          <p className="hero__eyebrow">Menu Option</p>
          <h1>Explore the hotel menu.</h1>
          <p className="hero__copy">
            Browse categories and review available dishes before moving to the
            customer order page.
          </p>
        </div>
        <div className="sub-hero__actions">
          <Link to="/" className="ghost-button">
            Home
          </Link>
          <Link to="/menu-creation" className="ghost-button">
            Menu Creation
          </Link>
          <Link to="/customer-order" className="submit-button hero__link-button">
            Customer Order
          </Link>
        </div>
      </header>

      <section className="menu-section">
        <div className="section-heading">
          <h2>Menu</h2>
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

        {loading ? <p className="status-card">Loading menu...</p> : null}
        {!loading && error ? <p className="status-card error">{error}</p> : null}

        <div className="menu-grid">
          {visibleItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              quantity={0}
              onQuantityChange={() => {}}
              readOnly
            />
          ))}
        </div>
      </section>
    </div>
  );
}
