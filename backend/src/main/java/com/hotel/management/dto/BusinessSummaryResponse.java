package com.hotel.management.dto;

public class BusinessSummaryResponse {

    private final String startDate;
    private final String endDate;
    private final long todayOrderCount;
    private final double todayTotalAmount;
    private final long dateRangeOrderCount;
    private final double dateRangeTotalAmount;
    private final long completedOrderCount;
    private final double completedAmount;
    private final long pendingOrderCount;

    public BusinessSummaryResponse(
            String startDate,
            String endDate,
            long todayOrderCount,
            double todayTotalAmount,
            long dateRangeOrderCount,
            double dateRangeTotalAmount,
            long completedOrderCount,
            double completedAmount,
            long pendingOrderCount
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.todayOrderCount = todayOrderCount;
        this.todayTotalAmount = todayTotalAmount;
        this.dateRangeOrderCount = dateRangeOrderCount;
        this.dateRangeTotalAmount = dateRangeTotalAmount;
        this.completedOrderCount = completedOrderCount;
        this.completedAmount = completedAmount;
        this.pendingOrderCount = pendingOrderCount;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public long getTodayOrderCount() {
        return todayOrderCount;
    }

    public double getTodayTotalAmount() {
        return todayTotalAmount;
    }

    public long getDateRangeOrderCount() {
        return dateRangeOrderCount;
    }

    public double getDateRangeTotalAmount() {
        return dateRangeTotalAmount;
    }

    public long getCompletedOrderCount() {
        return completedOrderCount;
    }

    public double getCompletedAmount() {
        return completedAmount;
    }

    public long getPendingOrderCount() {
        return pendingOrderCount;
    }
}
