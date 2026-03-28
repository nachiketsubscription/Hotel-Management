import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="hero hero--home">
        <div className="hero__content">
          <p className="hero__eyebrow">Hotel Dining Service</p>
          <h1>Place your room service order with ease.</h1>
          <p className="hero__copy">
            Move directly to the customer order page to select dishes, enter
            room details, and submit the order.
          </p>
          <div className="hero__actions">
            <Link to="/customer-order" className="submit-button hero__link-button">
              Customer Order
            </Link>
            <Link to="/business" className="ghost-button hero__link-button">
              Business
            </Link>
            <Link to="/menu-creation" className="ghost-button hero__link-button">
              Menu Creation
            </Link>
            <Link to="/order-history" className="ghost-button hero__link-button">
              Order Details
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <span>Quick Access</span>
          <strong>Order now</strong>
          <p>Start from the customer order page or review previous orders from order details.</p>
        </div>
      </header>
    </div>
  );
}
