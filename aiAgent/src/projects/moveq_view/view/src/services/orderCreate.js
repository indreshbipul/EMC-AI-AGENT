// Order Create Service - Handle terminal and bus availability

const BASE_URL = 'https://api.example.com'; // Replace with actual API URL

export const orderCreate = {
  // Get list of terminals (called on page load)
  getTerminals: async () => {
    try {
      const response = await fetch(`${BASE_URL}/terminals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch terminals');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('getTerminals error:', error);
      return { success: false, message: error.message, data: [] };
    }
  },

  // Search bus availability (called when user clicks search)
  searchBusAvailability: async (searchParams) => {
    try {
      const { pickupTerminal, deliveryTerminal, pickupDate, parcelSize } = searchParams;
      
      const response = await fetch(`${BASE_URL}/buses/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup_terminal: pickupTerminal,
          delivery_terminal: deliveryTerminal,
          pickup_date: pickupDate,
          parcel_size: parcelSize,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search bus availability');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('searchBusAvailability error:', error);
      return { success: false, message: error.message, data: [] };
    }
  },

  // Create shipment order
  createShipment: async (orderData) => {
    try {
      const response = await fetch(`${BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('createShipment error:', error);
      return { success: false, message: error.message };
    }
  },
};

export default orderCreate;
