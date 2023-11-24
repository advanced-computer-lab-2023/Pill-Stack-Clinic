import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import {
  Box,
  Text} from '@chakra-ui/react';
  import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const OrderDetailsPage = () => {
  const [orderDetailsArray, setOrderDetailsArray] = useState([]);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);
  const [cancelSuccess, setCancelSuccess] = useState(false); // State for success message



  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/orderDetails', {
          withCredentials: true,
        }); // Replace with your actual endpoint
        setOrderDetailsArray(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, []); // Run the effect only once when the component mounts

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing':
        return {
          color: '#ff9800', // Orange color for Processing
        };
      case 'Delivered':
        return {
          color: '#4caf50', // Green color for Delivered
        };
      case 'Cancelled':
        return {
          color: '#f44336', // Red color for Cancelled
        };
      default:
        return {};
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post('http://localhost:8000/order/cancel-order', {
        orderId:orderId,
      }, { withCredentials: true });
  
      if (response.status === 200 && response.data === 'Order cancelled successfully') {
        // Order cancellation was successful, update the local state
        setOrderDetailsArray((orders) => {
          return orders.map((order) => {
            if (order._id === orderId) {
              return { ...order, Status: 'Cancelled' };
            }
            return order;
          });
        });
        setCancelSuccess(true); // Show success message

      } else if (response.status === 404) {
        // Order not found, handle as needed
        console.log('Order not found');
      } else {
        // Handle other errors
        console.log('Order cancellation failed');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };
  
  return (
    <><Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Order Details</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
    <div style={styles.container}>
        {orderDetailsArray.length > 0 ? (
          orderDetailsArray.map((order, index) => (
            <div key={index} style={{ ...styles.orderContainer, ...getStatusStyle(order.Status) }}>
              <h2 style={styles.heading}>Order Details</h2>
              <p>Status: {order.Status}</p>
              <p>Address: {order.address}</p>
              <p>Bill: {order.bill}</p>
              <p>Date Added: {order.dateAdded}</p>

              {order.Items && order.Items.length > 0 ? (
                <>
                  <h3 style={styles.subHeading}>Items:</h3>
                  <div style={styles.itemsContainer}>
                    {order.Items.map((item, itemIndex) => (
                      <div key={itemIndex} style={styles.item}>
                        <p>Product ID: {item.productId}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>No items in this order.</p>
              )}
              {order.Status === 'Processing' && (
              <Button
                onClick={() => handleCancelOrder(order._id)}
                style={styles.cancelButton}
              >
                Cancel Order
              </Button>
            )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
      {cancelSuccess && (
      <Alert status="success">
        <AlertIcon />
        <AlertTitle>Confirmation</AlertTitle>
        <AlertDescription>Order was successfully Cancelled </AlertDescription>
      </Alert>
    )}
      {/* {orderDetailsArray.length > 0 ? (
        orderDetailsArray.map((order, index) => (
          <div key={index} style={{ ...styles.orderContainer, ...getStatusStyle(order.Status) }}>
            <h2 style={styles.heading}>Order Details</h2>
            <p>Status: {order.Status}</p>
            <p>Address: {order.address}</p>
            <p>Bill: {order.bill}</p>
            <p>Date Added: {order.dateAdded}</p>

            {order.Items && order.Items.length > 0 ? (
              <>
                <h3 style={styles.subHeading}>Items:</h3>
                <div style={styles.itemsContainer}>
                  {order.Items.map((item, itemIndex) => (
                    <div key={itemIndex} style={styles.item}>
                      <p>Product ID: {item.productId}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No items in this order.</p>
            )}
            
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )} */}
    </>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  itemsContainer: {
    marginTop: '10px',
  },
  item: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
  },
};

export default OrderDetailsPage;

