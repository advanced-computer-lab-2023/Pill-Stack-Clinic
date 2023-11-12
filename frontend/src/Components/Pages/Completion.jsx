import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {Box,Text} from '@chakra-ui/react';
import '../UI/button.css'

export default function Completion() {
  // Use the useParams hook to access the route parameters
  const { doctorUsername, appointmentId, amount, memberID ,manualMem} = useParams();
  const navigate = useNavigate();
  const back =()=>  navigate('/home');
  useEffect(() => {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    axios.post('http://localhost:8000/stripe/pay/confirm', {
      doctorUsername,
      appid: appointmentId,
      amount,
      member: memberID,
      manualMem:manualMem,
    }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        // Do additional handling here
      })
      .catch(error => {
        console.error(error);
      });
  }, [doctorUsername, appointmentId, amount, memberID,manualMem]);

  return (
    <div>
      <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}> Appointment booked successfully</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
      <h1></h1>
    </div>
  );
}

