import React from "react";
import { Link } from "react-router-dom";
import { Truck, BarChart3, Users, Shield, Search } from "lucide-react";

const Homepage = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Shipping",
      description: "Reliable delivery services with real-time tracking"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into your shipping operations"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-User Support",
      description: "Role-based access for admins, drivers, and customers"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security for your logistics data"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="card-elevated max-w-4xl mx-auto p-12 text-center animate-fadeIn">
          <div className="mb-8">
            <Truck className="w-16 h-16 text-primary mx-auto mb-4" />
          </div>
          <h1 className="text-5xl font-bold text-primary mb-6">
            Welcome to Global Link Imports
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track shipments, manage deliveries, and monitor your orders all in one
            place. Experience seamless logistics management with our modern platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <button className="border-2 border-secondary text-secondary font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 hover:bg-secondary hover:text-white">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-secondary text-white font-semibold py-3 px-8 rounded-lg shadow-card transition duration-300 transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Global Link?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need for efficient logistics management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-elevated p-6 text-center animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="rounded-xl p-4 bg-primary/10 text-primary inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-20 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of businesses using Global Link for their logistics needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="gradient-primary text-white font-semibold py-3 px-8 rounded-lg shadow-card">
              Start Free Trial
            </button>
            <button className="btn-primary">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
