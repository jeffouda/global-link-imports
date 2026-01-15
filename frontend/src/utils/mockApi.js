// src/utils/mockApi.js - DEBUG VERSION
const DEFAULT_USERS = [
  { id: 1, username: 'Admin', email: 'admin@global.com', password: 'pass123', role: 'admin' },
  { id: 2, username: 'Driver', email: 'driver@global.com', password: 'pass123', role: 'driver' },
  { id: 3, username: 'Customer', email: 'customer@global.com', password: 'pass123', role: 'customer' }
];

const DEFAULT_SHIPMENTS = [
  {
    id: 1,
    destination: 'Nairobi',
    payment_status: 'Paid',
    status: 'Delivered',
    customer_id: 3,
    driver_id: 2,
    created_at: '2023-01-01T00:00:00Z',
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ]
  },
  {
    id: 2,
    destination: 'Mombasa',
    payment_status: 'Unpaid',
    status: 'In Transit',
    customer_id: 3,
    driver_id: 2,
    created_at: '2023-01-02T00:00:00Z',
    items: [
      { product_id: 1, quantity: 1 }
    ]
  },
  {
    id: 3,
    destination: 'Kisumu',
    payment_status: 'Paid',
    status: 'Pending',
    customer_id: 3,
    driver_id: null,
    created_at: '2023-01-03T00:00:00Z',
    items: [
      { product_id: 3, quantity: 3 }
    ]
  }
];

const getUsers = () => {
  return DEFAULT_USERS;
};

const saveUsers = (users) => {
  // Temporarily disabled
};

const getShipments = () => {
  const stored = localStorage.getItem('shipments');
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('shipments', JSON.stringify(DEFAULT_SHIPMENTS));
    return DEFAULT_SHIPMENTS;
  }
};

const saveShipments = (shipments) => {
  localStorage.setItem('shipments', JSON.stringify(shipments));
};

export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("--- DEBUG LOGIN ATTEMPT ---");
      console.log("Input Email:", email);
      console.log("Input Password:", password);

      const users = getUsers();
      console.log("Available Mock Users:", users);

      // Sanitize inputs
      const sanitizedEmail = email.toLowerCase().trim();
      const user = users.find(u => u.email.toLowerCase() === sanitizedEmail);

      if (user) {
        console.log("Match Found!");
        console.log("Stored Password:", user.password);
        console.log("Input Password:", password);
        console.log("Password Match:", user.password === password);

        if (user.password === password) {
          resolve({
            access_token: "mock_jwt_access_token",
            refresh_token: "mock_jwt_refresh_token",
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      } else {
        console.log("No match. Check for typos.");
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const mockRegister = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        reject(new Error('Email already registered'));
        return;
      }
      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'customer'
      };
      users.push(newUser);
      saveUsers(users);
      resolve({
        message: "User registered successfully",
        user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
      });
    }, 1000);
  });
};

export const mockGetShipments = (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shipments = getShipments();
      let filteredShipments = shipments;
      if (user.role === 'customer') {
        filteredShipments = shipments.filter(s => s.customer_id === user.id);
      }
      // Admins and drivers see all
      resolve(filteredShipments);
    }, 500);
  });
};

export const mockCreateShipment = (shipmentData, user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shipments = getShipments();
      const newShipment = {
        id: shipments.length + 1,
        tracking: `GLI-${Date.now().toString().slice(-6)}`,
        destination: shipmentData.destination,
        payment: 'Unpaid',
        status: 'Pending',
        customer_id: user.id,
        driver_id: null,
        created_at: new Date().toISOString(),
        items: shipmentData.items,
        route: `Nairobi → ${shipmentData.destination}`,
        customer: user.username,
        estDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      shipments.push(newShipment);
      saveShipments(shipments);
      resolve(newShipment);
    }, 500);
  });
};

export const mockUpdateShipment = (id, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipments();
      const shipment = shipments.find(s => s.id === id);
      if (shipment) {
        Object.assign(shipment, updates);
        saveShipments(shipments);
        resolve(shipment);
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};

export const mockGetShipmentByTracking = (tracking) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shipments = getShipments();
      const shipment = shipments.find(s => s.tracking === tracking);
      resolve(shipment);
    }, 500);
  });
};

export const mockDeleteShipment = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipments();
      const index = shipments.findIndex(s => s.id === id);
      if (index !== -1) {
        shipments.splice(index, 1);
        saveShipments(shipments);
        resolve({ message: 'Shipment deleted successfully' });
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};

export const mockUpdateShipmentStatus = (id, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipments();
      const shipment = shipments.find(s => s.id === id);
      if (shipment) {
        shipment.status = newStatus;
        saveShipments(shipments);
        resolve(shipment);
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};

export const mockUpdatePaymentStatus = (id, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipments();
      const shipment = shipments.find(s => s.id === id);
      if (shipment) {
        shipment.payment_status = newStatus;
        saveShipments(shipments);
        resolve(shipment);
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};