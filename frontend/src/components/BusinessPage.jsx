import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api";

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
}

export default function BusinessPage() {
  const today = useMemo(() => new Date(), []);
  const sevenDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }, []);

  const [filters, setFilters] = useState({
    startDate: formatDate(sevenDaysAgo),
    endDate: formatDate(today)
  });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/orders/business-summary?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load business summary.");
        }

        setSummary(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [filters]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <div className="page-shell">
      <header className="sub-hero">
        <div>
          <p className="hero__eyebrow">Business</p>
          <h1>Business summary and revenue view.</h1>
          <p className="hero__copy">
            Review today&apos;s amount, date range totals, and current order
            progress from one place.
          </p>
        </div>
        <div className="sub-hero__actions">
          <Link to="/" className="ghost-button">
            Home
          </Link>
          <Link to="/order-history" className="ghost-button">
            Order Details
          </Link>
        </div>
      </header>

      <section className="business-filters order-form">
        <div className="section-heading">
          <h2>Date Range</h2>
        </div>
        <div className="business-filters__grid">
          <label>
            Start Date
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              max={filters.endDate}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters.startDate}
            />
          </label>
        </div>
      </section>

      {loading ? <p className="status-card">Loading business summary...</p> : null}
      {!loading && error ? <p className="status-card error">{error}</p> : null}

      {!loading && !error && summary ? (
        <section className="business-grid">
          <article className="business-card">
            <p className="business-card__label">Today&apos;s Amount</p>
            <strong>{formatCurrency(summary.todayTotalAmount)}</strong>
            <span>{summary.todayOrderCount} orders today</span>
          </article>

          <article className="business-card">
            <p className="business-card__label">Date Range Amount</p>
            <strong>{formatCurrency(summary.dateRangeTotalAmount)}</strong>
            <span>
              {summary.startDate} to {summary.endDate}
            </span>
          </article>

          <article className="business-card">
            <p className="business-card__label">Completed Amount</p>
            <strong>{formatCurrency(summary.completedAmount)}</strong>
            <span>{summary.completedOrderCount} completed orders</span>
          </article>

          <article className="business-card">
            <p className="business-card__label">Pending Orders</p>
            <strong>{summary.pendingOrderCount}</strong>
            <span>{summary.dateRangeOrderCount} total orders in range</span>
          </article>
        </section>
      ) : null}
    </div>
  );
}
