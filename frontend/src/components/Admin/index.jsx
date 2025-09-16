import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Dashboard";
import AdminOrders from "./Orders";
import AdminProducts from "./Products";
import AdminReturns from "./Returns";
import AdminCoupons from "./Coupons";
import AdminUsers from "./Users";
import AdminAnalytics from "./Analytics";
import AdminSystem from "./System";
import AdminActivity from "./Activity";
import AdminExport from "./Export";

export default function AdminLayout() {
  return (
    <div className="p-4">
      <div className="flex gap-3 mb-4 overflow-x-auto">
        <Tab to="/admin">Overview</Tab>
        <Tab to="/admin/orders">Orders</Tab>
        <Tab to="/admin/products">Products</Tab>
        <Tab to="/admin/returns">Returns</Tab>
        <Tab to="/admin/coupons">Coupons</Tab>
        <Tab to="/admin/users">Users</Tab>
        <Tab to="/admin/analytics">Analytics</Tab>
        <Tab to="/admin/system">System</Tab>
        <Tab to="/admin/activity">Activity</Tab>
        <Tab to="/admin/export">Export</Tab>
      </div>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/returns" element={<AdminReturns />} />
        <Route path="/coupons" element={<AdminCoupons />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/system" element={<AdminSystem />} />
        <Route path="/activity" element={<AdminActivity />} />
        <Route path="/export" element={<AdminExport />} />
      </Routes>
    </div>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `px-3 py-2 rounded border ${isActive ? 'bg-black text-white' : ''}`}>
      {children}
    </NavLink>
  );
}


