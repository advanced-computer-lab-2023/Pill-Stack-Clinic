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

const DoctorRegisterPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Username: '',
    Name: '',
    Email: '',
    Password: '',
    DateOfBirth: '',
    HourlyRate: '',
    Affiliation: '',
    EducationalBackground: '',
    Speciality:'',
    idDocument: null,
    medicalLicenseDocument: null,
    medicalDegreeDocument: null
  });

  const onChange = e => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setFormData(formData => ({ ...formData, [name]: files[0] }));
    } else {
      setFormData(formData => ({ ...formData, [name]: value }));
    }
  };
  const back =()=>  navigate(-1);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post('http://localhost:8000/doc_register', payload);
  
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
      let errorMessage = 'Registration failed due to an unexpected error.';
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
        <Input type="text" name="Username" value={formData.Username} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input type="text" name="Name" value={formData.Name} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="Email" name="Email" value={formData.Email} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="Password" name="Password" value={formData.Password} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Date of Birth</FormLabel>
        <Input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Hourly Rate</FormLabel>
        <Input type="number" name="HourlyRate" value={formData.HourlyRate} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Affiliation</FormLabel>
        <Input type="text" name="Affiliation" value={formData.Affiliation} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Educational Background</FormLabel>
        <Input type="text" name="EducationalBackground" value={formData.EducationalBackground} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Speciality</FormLabel>
        <Input type="text" name="Speciality" value={formData.Speciality} onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>ID Document</FormLabel>
        <Input type="file" name="idDocument" onChange={onChange} />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Medical License Document</FormLabel>
        <Input type="file" name="medicalLicenseDocument" onChange={onChange} />
      </FormControl>

      
        <FormControl isRequired>
          <FormLabel>Medical Degree Document</FormLabel>
          <Input type="file" name="medicalDegreeDocument" onChange={onChange} />
        </FormControl>

        <Button colorScheme="teal" type="submit">Register</Button>
      </VStack>
    </Box>
  );
  };
  export default DoctorRegisterPage;
