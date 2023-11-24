import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import {
  Box,
  Text}
  from '@chakra-ui/react';
export default function CompletionMed() {
  // Use the useParams hook to access the route parameters
  const { address,intentid } = useParams();
  const navigate = useNavigate();
  const back =()=>  navigate("/home");

  useEffect(() => {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    
    axios.post('http://localhost:8000/order/orderCredit/confirm', {
      address:address,
      intentId:intentid,
    }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        // Do additional handling here
      })
      .catch(error => {
        console.error(error);
      });
  }, [address]);

  return (
    <div>
      <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}>Order placed successfully</Text>
        <button className="btn" onClick={back}>Home</button>
      </Box>
    </div>
  );
}

