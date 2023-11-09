import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Box, Input, Button, FormControl, FormLabel, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';

function OTP() {
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const navigate = useNavigate();

  const checkOTP = async () => {
    try {
      const response = await axios.post("http://localhost:8000/checkOTP", { otp, email });
      console.log(response.data);
      if (response.data.success) {
        setMessage('');
        setStep(2);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error checking OTP:', error);
      setMessage('An error occurred while checking OTP');
    }
  };

  const resetPass = async () => {
    try {
      const response = await axios.post("http://localhost:8000/resetPass", { newPassword, email });
      console.log(response.data);
      if (response.data.success) {
        setMessage('Password changed successfully.');
        navigate('/');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred while resetting the password');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      checkOTP();
    } else if (step === 2) {
      resetPass();
    }
  };

  return (
    <Box p={4} maxW="md" m="auto" mt="10%">
      <Heading mb={4}>Password Reset</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          {step === 1 && (
            <>
              <FormLabel htmlFor="otp">Enter OTP</FormLabel>
              <Input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
            </>
          )}

          {step === 2 && (
            <>
              <FormLabel htmlFor="newPassword">Enter New Password</FormLabel>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </>
          )}
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>

      <Text mt={4} color={message.includes('successfully') ? 'green.500' : 'red.500'}>
        {message}
      </Text>
    </Box>
  );
}

export default OTP;
