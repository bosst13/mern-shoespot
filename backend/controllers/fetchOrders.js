
const Order = require('../models/Order');  // Import the Order model
const User = require('../models/UserModel');  // Import the User model
const { admin, db} = require('../utils/firebaseConfig');
// Aggregated order status counts
const getOrdersData = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: "$status",  // Group by the 'status' field
          count: { $sum: 1 },  // Count the number of orders in each status group
        }
      },
      {
        $sort: { _id: 1 }  // Optionally, sort by status or another field
      }
    ]);
    res.json(orders);  // Send aggregated data as JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });  // Handle any errors
  }
};

// Get all orders with populated product and user info
const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.createdAt = query.createdAt || {};
      query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('products.productId')
      .populate('userId');

    const ordersByMonth = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!acc[month]) {
        acc[month] = { month, products: {} };
      }

      order.products.forEach(product => {
        const productId = product.productId._id.toString();
        if (!acc[month].products[productId]) {
          acc[month].products[productId] = { name: product.productId.name, quantity: 0 };
        }
        acc[month].products[productId].quantity += product.quantity;
      });

      return acc;
    }, {});

    const groupedOrders = Object.values(ordersByMonth).map(monthData => {
      const mostBoughtProduct = Object.values(monthData.products).reduce((max, product) => {
        return product.quantity > max.quantity ? product : max;
      }, { name: '', quantity: 0 });

      return {
        month: monthData.month,
        mostBoughtProduct: mostBoughtProduct.name,
        quantity: mostBoughtProduct.quantity
      };
    });

    res.json(groupedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all distinct statuses of the products with corresponding IDs
const getAllStatuses = async (req, res) => {
    try {
      const statuses = await Order.aggregate([
        {
          $unwind: "$products"  // Deconstruct the products array field
        },
        {
          $lookup: {
            from: 'products',  // The name of the products collection
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        {
          $unwind: "$productDetails"  // Deconstruct the productDetails array field
        },
        {
          $group: {
            _id: "$_id",  // Group by order ID
            status: { $first: "$status" },  // Get the status for each order
            products: { $push: "$productDetails.name" }  // Collect all product names for each order
          }
        },
        {
          $project: {
            orderId: "$_id",
            status: 1,
            products: 1,
            _id: 0
          }
        }
      ]);
      res.json(statuses);  // Send order IDs with corresponding status and product names as JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });  // Handle any errors
    }
  };

  const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
    
      // Find and update the order status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Get the user who placed the order (assuming the userId is stored in the order)
      const user = await User.findById(updatedOrder.userId); // Adjust this based on your Order schema
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send a push notification to the user
      const fcmToken = user.fcmToken;
      if (fcmToken) {
        const payload = {
          notification: {
            title: 'Order Status Updated',
            body: `Your order ${orderId} has been ${status}.`,
          },
          token: fcmToken,
        };
  
        // Send notification via FCM
        await admin.messaging().send(payload);
        console.log('Notification sent successfully');
      } else {
        console.log('FCM token not found for the user');
      }
  
      // Respond with the updated order
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = { getOrdersData, getAllOrders, getAllStatuses, updateOrderStatus };