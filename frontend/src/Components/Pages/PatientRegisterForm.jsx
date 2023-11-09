import React, { useState } from 'react';
import Axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
// PatientRegisterForm.jsx


const PatientRegisterForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    mobile: '',
    EmergencyContact_name: '',
    EmergencyContact_mobileNumber: ''
  });

  const { username, name, email, password, dob, gender, mobile, EmergencyContact_name, EmergencyContact_mobileNumber } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:8000/Patientregister', formData);
    
      toast({
        title: 'Registration Successful',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      let errorMessage = "Registration failed due to an unexpected error."; // Default error message
      // Check if the error response has a data property and if it contains a message
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message; // Fallback to a more generic error message
      }
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Registration Error:", errorMessage); // Log the error for debugging
    }
  };
  

  return (
    <Box p={4}>
      <form onSubmit={onSubmit}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" value={username} onChange={onChange} />
        </FormControl>
        
        <FormControl isRequired mt={4}>
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" value={name} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={email} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={password} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Date of Birth</FormLabel>
          <Input type="date" name="dob" value={dob} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Gender</FormLabel>
          <Input type="text" name="gender" value={gender} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Mobile Number</FormLabel>
          <Input type="tel" name="mobile" value={mobile} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Emergency Contact Name</FormLabel>
          <Input type="text" name="EmergencyContact_name" value={EmergencyContact_name} onChange={onChange} />
        </FormControl>

        <FormControl isRequired mt={4}>
          <FormLabel>Emergency Contact Mobile Number</FormLabel>
          <Input type="tel" name="EmergencyContact_mobileNumber" value={EmergencyContact_mobileNumber} onChange={onChange} />
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">Register</Button>
      </form>
    </Box>
  );
};

export default PatientRegisterForm;