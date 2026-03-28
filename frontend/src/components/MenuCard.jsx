export default function MenuCard({
  item,
  quantity,
  onQuantityChange,
  readOnly = false
}) {
  const nonVegKeywords = ["chicken", "mutton", "fish", "prawn", "egg"];
  const itemText = `${item.name} ${item.description}`.toLowerCase();
  const normalizedFoodType = item.foodType?.trim().toLowerCase();
  const isNonVeg =
    normalizedFoodType === "non-veg" ||
    (normalizedFoodType !== "veg" &&
      nonVegKeywords.some((keyword) => itemText.includes(keyword)));

  return (
    <article className="menu-card">
      <div className="menu-card__header">
        <div>
          <div className="menu-card__meta">
            <p className="menu-card__category">{item.category}</p>
            <span
              className={`menu-card__food-type ${
                isNonVeg ? "menu-card__food-type--nonveg" : "menu-card__food-type--veg"
              }`}
            >
              <span className="menu-card__food-dot" />
              {isNonVeg ? "Non-Veg" : "Veg"}
            </span>
          </div>
          <h3>{item.name}</h3>
        </div>
        <strong>Rs. {item.price.toFixed(2)}</strong>
      </div>
      <p className="menu-card__description">{item.description}</p>
      {readOnly ? null : (
        <div className="menu-card__actions">
          <span className="menu-card__qty-label">Quantity</span>
          <div className="menu-card__qty-control">
            <button
              type="button"
              className="menu-card__qty-button"
              onClick={() => onQuantityChange(item.id, Math.max(0, quantity - 1))}
              aria-label={`Decrease quantity for ${item.name}`}
            >
              -
            </button>
            <div className="menu-card__qty-value" aria-live="polite">
              {quantity}
            </div>
            <button
              type="button"
              className="menu-card__qty-button"
              onClick={() => onQuantityChange(item.id, quantity + 1)}
              aria-label={`Increase quantity for ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
