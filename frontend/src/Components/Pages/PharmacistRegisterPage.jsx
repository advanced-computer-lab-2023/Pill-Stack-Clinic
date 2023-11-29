// PharmacistRegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const PharmacistRegisterPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    dob: '',
    hourly_rate: '',
    affiliation: '',
    educational_background: '',
    IDDocument: null,
    pharmacyDegreeDocument: null,
    workingLicenseDocument: null
  });
  const back =()=>  navigate(-1);

  const onChange = e => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setFormData(formData => ({ ...formData, [name]: files[0] }));
    } else {
      setFormData(formData => ({ ...formData, [name]: value }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    try {
        const response = await axios.post('http://localhost:8000/doc_register', payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          

      if (response.data.success) {
        toast({
          title: 'Registration Successful',
          description: response.data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/'); // Redirect to the home page or login page
      } else {
        toast({
          title: 'Registration Failed',
          description: response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      let errorMessage = "Registration failed due to an unexpected error.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
        <Button onClick={back}>back</Button>
      <VStack spacing={4} as="form" onSubmit={onSubmit} width="100%" maxWidth="500px" margin="auto">
        {/* Form Controls */}
        {/* ... other form controls ... */}
        <FormControl isRequired>
        <FormLabel>Username</FormLabel>
        <Input type="text" name="username" value={formData.username} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" value={formData.password} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input type="text" name="name" value={formData.name} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" value={formData.email} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Date of Birth</FormLabel>
        <Input type="date" name="dob" value={formData.dob} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Hourly Rate</FormLabel>
        <Input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Affiliation</FormLabel>
        <Input type="text" name="affiliation" value={formData.affiliation} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Educational Background</FormLabel>
        <Input type="text" name="educational_background" value={formData.educational_background} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>ID Document</FormLabel>
        <Input type="file" name="IDDocument" onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Pharmacy Degree Document</FormLabel>
        <Input type="file" name="pharmacyDegreeDocument" onChange={onChange} />
      </FormControl>

      
        <FormControl isRequired>
          <FormLabel>Working License Document</FormLabel>
          <Input type="file" name="workingLicenseDocument" onChange={onChange} />
        </FormControl>

        <Button colorScheme="teal" type="submit">Register</Button>
      </VStack>
    </Box>
  );
  };
  export default PharmacistRegisterPage;