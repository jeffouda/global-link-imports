import React from "react";
import { Package, Truck, DollarSign, Users, MapPin, CheckCircle, Clock, Star, ShoppingCart, CreditCard } from "lucide-react";

const StatCard = ({ icon, value, label, color = "primary" }) => {
  const getIconClasses = (color) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 text-primary";
      case "secondary":
        return "bg-secondary/10 text-secondary";
      case "success":
        return "bg-success/10 text-success";
      case "info":
        return "bg-info/10 text-info";
      case "warning":
        return "bg-warning/10 text-warning";
      case "destructive":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="card-elevated p-6 animate-fadeIn">
      <div className="flex items-center space-x-4">
        <div className={`rounded-xl p-3 ${getIconClasses(color)}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ userRole }) => {
  const getStats = (role) => {
    switch (role) {
      case "admin":
        return [
          { icon: <Package className="w-6 h-6" />, value: "247", label: "Total Shipments", color: "primary" },
          { icon: <Truck className="w-6 h-6" />, value: "42", label: "Active Deliveries", color: "secondary" },
          { icon: <DollarSign className="w-6 h-6" />, value: "$12,450", label: "Revenue Today", color: "success" },
          { icon: <Users className="w-6 h-6" />, value: "18", label: "Active Drivers", color: "info" },
        ];
      case "driver":
        return [
          { icon: <MapPin className="w-6 h-6" />, value: "8", label: "Assigned Shipments", color: "primary" },
          { icon: <CheckCircle className="w-6 h-6" />, value: "5", label: "Completed Today", color: "success" },
          { icon: <Clock className="w-6 h-6" />, value: "3", label: "Pending Pickups", color: "warning" },
          { icon: <Star className="w-6 h-6" />, value: "4.8", label: "Rating", color: "secondary" },
        ];
      case "customer":
        return [
          { icon: <ShoppingCart className="w-6 h-6" />, value: "12", label: "Total Orders", color: "primary" },
          { icon: <Package className="w-6 h-6" />, value: "3", label: "In Transit", color: "secondary" },
          { icon: <CheckCircle className="w-6 h-6" />, value: "9", label: "Delivered", color: "success" },
          { icon: <CreditCard className="w-6 h-6" />, value: "$2,340", label: "Total Spent", color: "info" },
        ];
      default:
        return [];
    }
  };

  const stats = getStats(userRole);

  return (
    <div className="space-y-8">
      <div className="card-elevated p-6 animate-fadeIn">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {userRole === "admin" ? "Admin Dashboard" :
           userRole === "driver" ? "Driver Dashboard" :
           "Customer Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your overview for today.
        </p>
      </div>

      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      ) : (
        <div className="card-elevated p-12 text-center animate-fadeIn">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Your dashboard will populate as you use the system.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {userRole === "admin" && (
          <div className="card-elevated p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm text-muted-foreground">New shipment #1234 created</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">Payment received for order #567</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-muted-foreground">Driver assigned to shipment #890</span>
              </div>
            </div>
          </div>
        )}

        {userRole === "driver" && (
          <div className="card-elevated p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-foreground mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Pickup #123</div>
                  <div className="text-sm text-muted-foreground">Downtown Warehouse</div>
                </div>
                <div className="text-sm font-medium text-secondary">9:00 AM</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Delivery #456</div>
                  <div className="text-sm text-muted-foreground">Main Street</div>
                </div>
                <div className="text-sm font-medium text-secondary">2:00 PM</div>
              </div>
            </div>
          </div>
        )}

        {userRole === "customer" && (
          <div className="card-elevated p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-foreground mb-4">Order Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Order #789</div>
                  <div className="text-sm text-muted-foreground">Electronics Package</div>
                </div>
                <div className="status-badge bg-secondary text-secondary-foreground">In Transit</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">Order #101</div>
                  <div className="text-sm text-muted-foreground">Books Collection</div>
                </div>
                <div className="status-badge bg-success text-success-foreground">Delivered</div>
              </div>
            </div>
          </div>
        )}

        <div className="card-elevated p-6 animate-fadeIn">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary text-center">New Shipment</button>
            <button className="btn-primary text-center">Track Order</button>
            <button className="btn-primary text-center">View Reports</button>
            <button className="btn-primary text-center">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
