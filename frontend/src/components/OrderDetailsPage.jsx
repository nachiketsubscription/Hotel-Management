import { Link, useLocation, useNavigate } from "react-router-dom";

const ORDER_STATUSES = ["Ordered", "Accepted", "Completed"];

export default function OrderDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page-shell">
        <section className="order-page">
          <div className="order-page__empty">
            <p className="order-details__eyebrow">Order Details</p>
            <h1>No order found</h1>
            <p>
              Place an order from the menu page first, then the order summary
              will appear here.
            </p>
            <button
              type="button"
              className="submit-button"
              onClick={() => navigate("/customer-order")}
            >
              Back To Customer Order
            </button>
          </div>
        </section>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status || "Ordered");

  return (
    <div className="page-shell">
      <section className="order-page">
        <div className="order-page__hero">
          <div>
            <p className="order-details__eyebrow">Order Confirmed</p>
            <h1>Order #{order.orderId}</h1>
            <div className="order-status-list">
              {ORDER_STATUSES.map((status, index) => (
                <div
                  key={status}
                  className={`order-status-chip ${
                    index <= currentStatusIndex ? "active" : ""
                  }`}
                >
                  {status}
                </div>
              ))}
            </div>
            <p>
              Your room service request has been sent successfully for table{" "}
              {order.tableNumber}.
            </p>
          </div>
          <div className="order-page__total">
            <span>Total Amount</span>
            <strong>Rs. {order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="order-page__grid">
          <section className="order-details">
            <div className="order-details__header">
              <div>
                <p className="order-details__eyebrow">Customer</p>
                <h3>{order.customerName}</h3>
              </div>
            </div>

            <div className="order-details__meta">
              <p>
                <span>Status</span>
                {order.status}
              </p>
              <p>
                <span>Table</span>
                {order.tableNumber}
              </p>
              <p>
                <span>Ordered At</span>
                {new Date(order.orderedAt).toLocaleString("en-IN")}
              </p>
            </div>

            {order.specialInstructions ? (
              <div className="order-details__instructions">
                <span>Special Instructions</span>
                <p>{order.specialInstructions}</p>
              </div>
            ) : null}
          </section>

          <section className="order-details">
            <div className="order-details__header">
              <div>
                <p className="order-details__eyebrow">Ordered Items</p>
                <h3>Summary</h3>
              </div>
            </div>

            <div className="order-details__items">
              <ul>
                {order.items.map((item) => (
                  <li key={`${order.orderId}-${item.menuItemId}`}>
                    <span>
                      {item.menuItemName} x {item.quantity}
                    </span>
                    <strong>Rs. {item.lineTotal.toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cart-summary__total order-page__final-total">
              <span>Total</span>
              <strong>Rs. {order.totalAmount.toFixed(2)}</strong>
            </div>
          </section>
        </div>

        <div className="order-page__actions">
          <Link to="/customer-order" className="ghost-button">
            Place Another Order
          </Link>
          <Link to="/order-history" className="ghost-button">
            Order Details
          </Link>
          <Link to="/menu" className="ghost-button">
            View Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
