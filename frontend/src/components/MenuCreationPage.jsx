import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

const initialForm = {
  name: "",
  category: "",
  description: "",
  foodType: "Veg",
  price: "",
  available: true
};

export default function MenuCreationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create menu item.");
      }

      setSuccess(`Menu item "${data.name}" created successfully.`);
      setFormData(initialForm);
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
          <p className="hero__eyebrow">Menu Creation</p>
          <h1>Create a new menu item.</h1>
          <p className="hero__copy">
            Add a new dish with category, description, price, and availability.
          </p>
        </div>
        <div className="sub-hero__actions">
          <Link to="/" className="ghost-button">
            Home
          </Link>
          <Link to="/menu" className="ghost-button">
            View Menu
          </Link>
        </div>
      </header>

      <section className="menu-creation-shell">
        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            Item Name
            <input
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="Enter menu item name"
              required
            />
          </label>

          <label>
            Category
            <input
              name="category"
              value={formData.category}
              onChange={handleFieldChange}
              placeholder="Breakfast, Main Course, Dessert..."
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFieldChange}
              placeholder="Describe the dish"
              rows="4"
              required
            />
          </label>

          <fieldset className="menu-creation__fieldset">
            <legend>Food Type</legend>
            <div className="menu-creation__radio-group">
              <label className="menu-creation__radio-option menu-creation__radio-option--veg">
                <input
                  type="radio"
                  name="foodType"
                  value="Veg"
                  checked={formData.foodType === "Veg"}
                  onChange={handleFieldChange}
                />
                <span>Veg</span>
              </label>
              <label className="menu-creation__radio-option menu-creation__radio-option--nonveg">
                <input
                  type="radio"
                  name="foodType"
                  value="Non-Veg"
                  checked={formData.foodType === "Non-Veg"}
                  onChange={handleFieldChange}
                />
                <span>Non-Veg</span>
              </label>
            </div>
          </fieldset>

          <label>
            Price
            <input
              name="price"
              type="number"
              min="1"
              step="0.01"
              value={formData.price}
              onChange={handleFieldChange}
              placeholder="Enter price"
              required
            />
          </label>

          <label className="menu-creation__checkbox">
            <input
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleFieldChange}
            />
            Available for ordering
          </label>

          {error ? <p className="form-message error">{error}</p> : null}
          {success ? <p className="form-message success">{success}</p> : null}

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Creating..." : "Create Menu Item"}
          </button>
        </form>
      </section>
    </div>
  );
}
