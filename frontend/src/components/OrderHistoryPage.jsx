import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrderId, setOpenOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error("Unable to load order history.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    setError("");
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update order status.");
      }

      const updatedOrder = await response.json();
      setOrders((current) =>
        current.map((order) => (order.orderId === orderId ? updatedOrder : order))
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div className="page-shell">
      <header className="sub-hero">
        <div>
          <p className="hero__eyebrow">Order Details</p>
          <h1>Review previous customer orders.</h1>
          <p className="hero__copy">
            See each order number, table, customer, current status, total, and
            ordered items on a dedicated order details page.
          </p>
        </div>
        <div className="sub-hero__actions">
          <Link to="/" className="ghost-button">
            Home
          </Link>
          <Link to="/customer-order" className="submit-button hero__link-button">
            Customer Order
          </Link>
        </div>
      </header>

      {loading ? <p className="status-card">Loading order details...</p> : null}
      {!loading && error ? <p className="status-card error">{error}</p> : null}

      {!loading && !error ? (
        <section className="history-grid">
          {orders.length === 0 ? (
            <p className="status-card">No orders have been placed yet.</p>
          ) : (
            orders.map((order) => (
              <article key={order.orderId} className="history-card">
                <div className="history-card__header">
                  <div>
                    <p className="order-details__eyebrow">Order</p>
                    <h2>{order.orderId}</h2>
                  </div>
                  <div className="history-card__summary">
                    <span className="history-card__table">Table {order.tableNumber}</span>
                    <span
                      className={`history-card__status history-card__status--${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="history-card__actions">
                  <button
                    type="button"
                    className="ghost-button history-card__button"
                    onClick={() =>
                      setOpenOrderId((current) =>
                        current === order.orderId ? null : order.orderId
                      )
                    }
                  >
                    {openOrderId === order.orderId ? "Hide Details" : "View Details"}
                  </button>
                  {order.status === "Ordered" ? (
                    <>
                      <button
                        type="button"
                        className="submit-button history-card__button"
                        disabled={updatingOrderId === order.orderId}
                        onClick={() => handleStatusChange(order.orderId, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="history-card__reject"
                        disabled={updatingOrderId === order.orderId}
                        onClick={() => handleStatusChange(order.orderId, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  {order.status === "Accepted" ? (
                    <button
                      type="button"
                      className="history-card__bill"
                      disabled={updatingOrderId === order.orderId}
                      onClick={() =>
                        navigate("/bill", {
                          state: {
                            order
                          }
                        })
                      }
                    >
                      Bill
                    </button>
                  ) : null}
                </div>

                {openOrderId === order.orderId ? (
                  <>
                    <div className="history-card__meta">
                      <p>
                        <span>Customer</span>
                        {order.customerName}
                      </p>
                      <p>
                        <span>Ordered At</span>
                        {new Date(order.orderedAt).toLocaleString("en-IN")}
                      </p>
                      <p>
                        <span>Total</span>
                        Rs. {order.totalAmount.toFixed(2)}
                      </p>
                      {order.status === "Completed" ? (
                        <p>
                          <span>Amount After Discount</span>
                          Rs. {order.amountPaid.toFixed(2)}
                        </p>
                      ) : null}
                    </div>

                    {order.specialInstructions ? (
                      <div className="history-card__instructions">
                        <span>Special Instructions</span>
                        <p>{order.specialInstructions}</p>
                      </div>
                    ) : null}

                    <div className="history-card__items">
                      <h3>Items</h3>
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
                  </>
                ) : null}
              </article>
            ))
          )}
        </section>
      ) : null}
    </div>
  );
}
