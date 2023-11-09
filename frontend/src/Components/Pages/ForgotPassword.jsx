import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Input, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/sendOTP", { email });
      console.log(response);
      if (response.data === "password reset otp sent to your email account") {
        setMessage('OTP sent successfully. Check your email for the OTP.');
        navigate(`/PasswordReset?email=${email}`);
      } else {
        setMessage('Failed to send OTP. Please check your email address.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('An error occurred while sending OTP.');
    }
  };

  return (
    <Flex align="center" justify="center" h="100vh">
      <Box p={4} maxW="sm" m="auto">
        <Heading mb={4}>Forgot Password</Heading>
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button colorScheme="teal" type="submit">
            Send Reset Email
          </Button>
        </form>
        <Text mt={4} color={message.includes('successfully') ? 'green.500' : 'red.500'}>
          {message}
        </Text>
      </Box>
    </Flex>
  );
}

export default ForgotPassword;
