import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import WarehouseDashboard from "pages/warehouse-dashboard";
import ExpensesTracking from "pages/expenses-tracking";
import ReservesManagement from "pages/reserves-management";
import InventoryAudit from "pages/inventory-audit";
import HistoryJournal from "pages/history-journal";
import Settings from "pages/settings";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<WarehouseDashboard />} />
          <Route path="/warehouse-dashboard" element={<WarehouseDashboard />} />
          <Route path="/expenses-tracking" element={<ExpensesTracking />} />
          <Route path="/reserves-management" element={<ReservesManagement />} />
          <Route path="/inventory-audit" element={<InventoryAudit />} />
          <Route path="/history-journal" element={<HistoryJournal />} />
          <Route path="/settings" element={<Settings />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;