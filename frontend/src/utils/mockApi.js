// src/utils/mockApi.js - Persistent version with localStorage
const DEFAULT_USERS = [
  { id: 1, username: 'Admin', email: 'admin@global.com', password: 'pass123', role: 'admin' },
  { id: 2, username: 'Driver User', email: 'driver@global.com', password: 'pass123', role: 'driver' },
  { id: 3, username: 'Customer', email: 'customer@global.com', password: 'pass123', role: 'customer' }
];

const DEFAULT_SHIPMENTS = [
  {
    id: 'GLI-2024-001',
    tracking: 'GLI-001',
    customer: 'John Doe',
    route: 'Nairobi → Mombasa',
    items: 'Electronics',
    status: 'In Transit',
    payment: 'Paid',
    estDelivery: '2023-01-15',
    customer_id: 3,
    driver_id: 2
  },
  {
    id: 'GLI-2024-002',
    tracking: 'GLI-002',
    customer: 'Jane Smith',
    route: 'Kisumu → Nairobi',
    items: 'Books',
    status: 'Pending',
    payment: 'Unpaid',
    estDelivery: '2023-01-16',
    customer_id: 3,
    driver_id: null
  }
];

const getShipmentsFromStorage = () => {
  const stored = localStorage.getItem('shipments');
  return stored ? JSON.parse(stored) : DEFAULT_SHIPMENTS;
};

const saveShipmentsToStorage = (shipments) => {
  localStorage.setItem('shipments', JSON.stringify(shipments));
};

export const getShipments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getShipmentsFromStorage());
    }, 100);
  });
};

export const getShipmentByTrackingId = async (tracking) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shipments = getShipmentsFromStorage();
      const shipment = shipments.find(s => s.tracking === tracking);
      resolve(shipment);
    }, 100);
  });
};

export const createShipment = async (shipmentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const shipments = getShipmentsFromStorage();
      const newShipment = {
        id: `GLI-2024-${Date.now()}`,
        tracking: `GLI-${Date.now().toString().slice(-6)}`,
        destination: shipmentData.destination,
        payment: 'Unpaid',
        status: 'Pending',
        customer_id: shipmentData.userId,
        driver_id: null,
        created_at: new Date().toISOString(),
        items: shipmentData.items,
        route: `Nairobi → ${shipmentData.destination}`,
        customer: shipmentData.customer || 'Customer',
        estDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      shipments.push(newShipment);
      saveShipmentsToStorage(shipments);
      resolve(newShipment);
    }, 500);
  });
};

export const updateShipment = async (updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipmentsFromStorage();
      const index = shipments.findIndex(s => s.id === updatedData.id);
      if (index !== -1) {
        shipments[index] = { ...shipments[index], ...updatedData };
        saveShipmentsToStorage(shipments);
        resolve(shipments[index]);
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};

export const deleteShipment = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipments = getShipmentsFromStorage();
      const index = shipments.findIndex(s => s.id === id);
      if (index !== -1) {
        shipments.splice(index, 1);
        saveShipmentsToStorage(shipments);
        resolve({ message: 'Shipment deleted successfully' });
      } else {
        reject(new Error('Shipment not found'));
      }
    }, 500);
  });
};

export const loginUser = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = DEFAULT_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
      if (user) {
        resolve({
          access_token: "mock_jwt_access_token",
          refresh_token: "mock_jwt_refresh_token",
          user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};