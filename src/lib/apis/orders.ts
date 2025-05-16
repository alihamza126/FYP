import Axios from "../Axios";

export async function fetchUserOrders() {
   try {
      const response = await Axios.get("/api/orders/my-orders");
      return response.data.orders;
   } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
   }
}


// for admim  
export async function fetchOrders() {
   try {
      const response = await Axios.get("/api/v1/orders");
      return response.data.data;
   } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
   }
}
// Fetch single order (admin)
export async function fetchOrder(id: string) {
   try {
      const response = await Axios.get(`/api/v1/orders/${id}`);
      const data = response.data.data;
      return data;
   } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
   }
}

// Create new order (admin)
export async function createOrder(orderData: any) {
   try {
      const response = await Axios.post("/api/v1/orders", orderData);
      if (!response.data.order) throw new Error("Failed to create order");
      return response.data.order;
   } catch (error) {
      console.error("Error creating order:", error);
      throw error;
   }
}

// Update order (admin)
export async function updateOrder(id: string, orderData: any) {
   try {
      const response = await Axios.put(`/api/v1/orders/${id}`, orderData);
      const data = response.data.order;
      return data;
   } catch (error) {
      console.error("Error updating order:", error);
      throw error;
   }
}

// Update order status (admin)
export async function updateOrderStatus(id: string, status: string) {
   try {
      const response = await Axios.patch(`/api/v1/orders/status/${id}`, {
         status,
      });

      const data = response.data.order;
      return data;
   } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
   }
}

// Delete order (admin)
export async function deleteOrder(id: string) {
   try {
      const response = await Axios.delete(`/api/v1/orders/${id}`);
      return true;
   } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
   }
}

// Fetch user orders (user)
