import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import Navigation from "../UI/Navigation";
import '../UI/Styles/innerPages.css';
import { Text,Box, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons'
export default function Completion() {
  // Use the useParams hook to access the route parameters
  const { doctorUsername, appointmentId, amount, memberID ,manualMem} = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
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
        setAppointmentData(response.data.app);

      })
      .catch(error => {
        console.error(error);
      });
  }, [doctorUsername, appointmentId, amount, memberID,manualMem]);

  return (
    <div>
    <Box>
      <Flex
        bg={`rgba(255, 255, 255, 0.0)`}
        color={useColorModeValue('gray.600', 'white')}
        minH={'70px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}>
        <div className='pageTitle'>
          Thank you for booking with us.
        </div>
        <Button
          onClick={() => navigate('/home')}
          ml={'auto'}
          bg={'#2CAED8'}
          color={'white'}
          borderRadius={'12px'}
          p={'12px'}
          _hover={{
            textDecoration: 'none',
            bg: '#23859B',
          }}>
          <ArrowLeftIcon/>
        </Button>
      </Flex>
    </Box>

    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mt={4}>
      <Text fontSize="xl" fontWeight="semibold">Your Appointment Details:</Text>
      {appointmentData ? (
        <Box mt={2}>
          <Text>Doctor: {appointmentData.DoctorUsername}</Text>
          <Text>Start time: {new Date(appointmentData.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Text>
          <Text>End time: {new Date(appointmentData.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Text>
          {/* Add more appointment details */}
        </Box>
      ) : (
        <p>Loading appointment details...</p>
      )}
    </Box>
  </div>
);
}

