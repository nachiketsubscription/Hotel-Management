import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

export default function BillPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [updatingPaid, setUpdatingPaid] = useState(false);
  const paid = order?.status === "Completed";

  if (!order) {
    return (
      <div className="page-shell">
        <section className="order-page">
          <div className="order-page__empty">
            <p className="order-details__eyebrow">Bill Details</p>
            <h1>No bill found</h1>
            <p>Open a bill from the order details page to view it here.</p>
            <button
              type="button"
              className="submit-button"
              onClick={() => navigate("/order-history")}
            >
              Back To Order Details
            </button>
          </div>
        </section>
      </div>
    );
  }

  const discountAmount = useMemo(() => {
    return (order.totalAmount * discountPercent) / 100;
  }, [discountPercent, order.totalAmount]);

  const finalTotal = useMemo(() => {
    return Math.max(0, order.totalAmount - discountAmount);
  }, [discountAmount, order.totalAmount]);

  async function handleMarkPaid() {
    setUpdatingPaid(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${order.orderId}/status?status=${encodeURIComponent(
          "Completed"
        )}&amountPaid=${encodeURIComponent(finalTotal.toFixed(2))}`,
        {
          method: "PUT"
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update bill status.");
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } finally {
      setUpdatingPaid(false);
    }
  }

  return (
    <div className="page-shell">
      <section className="bill-page">
        <div className="bill-page__hero">
          <div>
            <p className="order-details__eyebrow">Bill Details</p>
            <h1>Order #{order.orderId}</h1>
            <p>
              Bill for table {order.tableNumber} with all ordered menu items and
              totals.
            </p>
          </div>
          <div className="order-page__total">
            <span>Final Total</span>
            <strong>Rs. {finalTotal.toFixed(2)}</strong>
          </div>
        </div>

        <section className="bill-card">
          <div className="bill-card__header">
            <span>Menu</span>
            <span>Price</span>
          </div>

          <ul className="bill-card__items">
            {order.items.map((item) => (
              <li key={`${order.orderId}-${item.menuItemId}`}>
                <span>
                  {item.menuItemName} x {item.quantity}
                </span>
                <strong>Rs. {item.lineTotal.toFixed(2)}</strong>
              </li>
            ))}
          </ul>

          <div className="bill-card__total">
            <span>Subtotal</span>
            <strong>Rs. {order.totalAmount.toFixed(2)}</strong>
          </div>

          <div className="bill-card__controls">
            <label className="bill-card__field">
              Discount %
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(event) =>
                  setDiscountPercent(
                    Math.min(100, Math.max(0, Number(event.target.value) || 0))
                  )
                }
              />
            </label>
            <button
              type="button"
              className={paid ? "bill-card__paid" : "history-card__bill"}
              onClick={handleMarkPaid}
              disabled={paid || updatingPaid}
            >
              {paid ? "Paid" : updatingPaid ? "Updating..." : "Mark Paid"}
            </button>
          </div>

          <div className="bill-card__summary">
            <p>
              <span>Discount</span>
              <strong>Rs. {discountAmount.toFixed(2)}</strong>
            </p>
            <p>
              <span>Total After Discount</span>
              <strong>Rs. {finalTotal.toFixed(2)}</strong>
            </p>
          </div>
        </section>

        <div className="order-page__actions">
          <Link to="/order-history" className="ghost-button">
            Back To Order Details
          </Link>
        </div>
      </section>
    </div>
  );
}
