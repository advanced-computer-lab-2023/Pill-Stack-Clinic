import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowUpRegisterForm = () => {
    console.log("Request to /request-follow-upp received");
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorName: '',
    startDate: '',
    endDate: ''
  });

  const { doctorName, startDate, endDate } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/patient/request-follow-upp', { // Ensure URL matches your backend
        doctorName,
        startDate,
        endDate
      }, {
        withCredentials: true
      });

      toast({
        title: 'Follow-Up Request Successful',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(-1); // Redirect after successful submission
    } catch (error) {
      let errorMessage = "Follow-Up request failed due to an unexpected error.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Follow-Up Request Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error("Follow-Up Request Error:", errorMessage);
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={onSubmit}>
        <FormControl isRequired my={3}>
          <FormLabel>Doctor Name</FormLabel>
          <Input
            type="text"
            name="doctorName"
            value={doctorName}
            onChange={onChange}
            placeholder="Enter doctor's name"
          />
        </FormControl>

        <FormControl isRequired my={3}>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            name="startDate"
            value={startDate}
            onChange={onChange}
          />
        </FormControl>

        <FormControl isRequired my={3}>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            name="endDate"
            value={endDate}
            onChange={onChange}
          />
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">Submit Follow-Up Request</Button>
      </form>
    </Box>
  );
};

export default FollowUpRegisterForm;