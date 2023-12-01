import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RequestFollowUp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [doctorName, setDoctorName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
  try {
    await axios.post('http://localhost:8000/patient/request-follow-upp2', {
      fampatientUsername: state.familyMemberUsername, // Using the family member's username
      patientname: state.appointment.PatientName,
      doctorName,
      startDate,
      endDate,
    }, {
      withCredentials: true,
    });

      toast({
        title: 'Follow-Up Request Successful',
        description: 'Follow-up request sent successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(-1); // Navigate to the desired page after submission
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
      <form onSubmit={handleSubmit}>
        <FormControl isRequired my={3}>
          <FormLabel>Doctor's Name</FormLabel>
          <Input
            type="text"
            name="doctorName"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Enter doctor's name"
          />
        </FormControl>

        <FormControl isRequired my={3}>
          <FormLabel>Start Date</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            customInput={<Input />}
          />
        </FormControl>

        <FormControl isRequired my={3}>
          <FormLabel>End Date</FormLabel>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            customInput={<Input />}
          />
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">Submit Follow-Up Request</Button>
      </form>
    </Box>
  );
};

export default RequestFollowUp;
