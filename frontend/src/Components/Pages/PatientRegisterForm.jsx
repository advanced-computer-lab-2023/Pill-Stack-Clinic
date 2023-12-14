// import React, { useState } from 'react';
// import Axios from 'axios';
// import { Box, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
// import { useNavigate } from 'react-router-dom';
// // PatientRegisterForm.jsx


// const PatientRegisterForm = () => {
//   const toast = useToast();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     name: '',
//     email: '',
//     password: '',
//     dob: '',
//     gender: '',
//     mobile: '',
//     EmergencyContact_name: '',
//     EmergencyContact_mobileNumber: '',
//     EmergencyContact_Relation: ''

//   });

//   const { username, name, email, password, dob, gender, mobile, EmergencyContact_name, EmergencyContact_mobileNumber,EmergencyContact_Relation } = formData;

//   const onChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const back =()=>  navigate(-1);
//   const onSubmit = async e => {
//     e.preventDefault();
//     try {
//       const response = await Axios.post('http://localhost:8000/Patientregister', formData);
    
//       toast({
//         title: 'Registration Successful',
//         description: response.data.message,
//         status: 'success',
//         duration: 5000,
//         isClosable: true,
//       });
//       navigate('/');
//     } catch (error) {
//       let errorMessage = "Registration failed due to an unexpected error."; // Default error message
//       // Check if the error response has a data property and if it contains a message
//       if (error.response && error.response.data && error.response.data.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message; // Fallback to a more generic error message
//       }
//       toast({
//         title: 'Registration Failed',
//         description: errorMessage,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//       console.error("Registration Error:", errorMessage); // Log the error for debugging
//     }
//   };
  

//   return (
//     <Box p={4}>
//       <form onSubmit={onSubmit}>
//         <FormControl isRequired>
//           <FormLabel>Username</FormLabel>
//           <Input type="text" name="username" value={username} onChange={onChange} />
//         </FormControl>
        
//         <FormControl isRequired mt={4}>
//           <FormLabel>Name</FormLabel>
//           <Input type="text" name="name" value={name} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Email</FormLabel>
//           <Input type="email" name="email" value={email} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Password</FormLabel>
//           <Input type="password" name="password" value={password} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Date of Birth</FormLabel>
//           <Input type="date" name="dob" value={dob} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Gender</FormLabel>
//           <Input type="text" name="gender" value={gender} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Mobile Number</FormLabel>
//           <Input type="tel" name="mobile" value={mobile} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Emergency Contact Name</FormLabel>
//           <Input type="text" name="EmergencyContact_name" value={EmergencyContact_name} onChange={onChange} />
//         </FormControl>

//         <FormControl isRequired mt={4}>
//           <FormLabel>Emergency Contact Mobile Number</FormLabel>
//           <Input type="tel" name="EmergencyContact_mobileNumber" value={EmergencyContact_mobileNumber} onChange={onChange} />
//         </FormControl>
//         <FormControl isRequired mt={4}>
//           <FormLabel>Emergency Contact Relation</FormLabel>
//           <Input
//             type="text"
//             name="EmergencyContact_Relation"
//             value={EmergencyContact_Relation}
//             onChange={onChange}
//           />
//         </FormControl>
//         <Button mt={4} colorScheme="teal" type="submit">Register</Button>
//         <br></br>
//         <br></br>
//         <Button onClick={back}>back</Button>
//       </form>
//     </Box>
//   );
// };

// export default PatientRegisterForm;

import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  MDBSelect
}
from 'mdb-react-ui-kit';
import { Box, Button, FormControl, FormLabel, Input, useToast,
  Select,
  Text,
  Radio,
  RadioGroup,
  Stack,
  useRadio,

 } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import wallpaper from '../UI/Images/tealWall.jpg'

//mdb style
import 'mdb-react-ui-kit/dist/css/mdb.min.css';



function PatientRegisterForm() {
    const toast = useToast();
    const [allEntered, setAllEntered] = useState(false);
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
    EmergencyContact_mobileNumber: '',
    EmergencyContact_Relation: ''

  });

  //print form data on update
  useEffect(() => {
    console.log(formData);
  }, [formData]);


  const { username, name, email, password, dob, gender, mobile, EmergencyContact_name, EmergencyContact_mobileNumber,EmergencyContact_Relation } = formData;

  // const onChange = e => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   console.log(e.target.value, e.target.name, formData);
  //   //check if all fields are entered

  //   username != '' || 
  //   name != '' ||
  //   email != '' ||
  //   password != '' ||
  //   dob != '' ||
  //   gender != '' ||
  //   mobile != '' ||
  //   EmergencyContact_name != '' ||
  //   EmergencyContact_mobileNumber != '' ||
  //   EmergencyContact_Relation != '' ? setAllEntered(false) : setAllEntered(true);
  // };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
    // Check if all fields are filled
    const {
      username,
      name,
      email,
      password,
      dob,
      gender,
      mobile,
      EmergencyContact_name,
      EmergencyContact_mobileNumber,
      EmergencyContact_Relation
    } = formData;
  
    const allFieldsFilled =
      username !== '' &&
      name !== '' &&
      email !== '' &&
      password !== '' &&
      dob !== '' &&
      gender !== '' &&
      mobile !== '' &&
      EmergencyContact_name !== '' &&
      EmergencyContact_mobileNumber !== '' &&
      EmergencyContact_Relation !== '';
  
    setAllEntered(allFieldsFilled);
  };
  
  const back =()=>  navigate(-1);
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
      toast({
        title: 'Registration Failed',
        description: "Please Enter all fields correctly",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
    <MDBContainer fluid className=' d-flex justify-content-center'  
    style={{height:'max-content', backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
     >
      <MDBRow className=' d-flex justify-content-center align-items-center w-75' style={{height:'fit-content'}} >
        <MDBCol >
          <MDBCard className='my-4' style={{    
            //frosty glass effect
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust opacity as needed
            backdropFilter: 'blur(5px)'  
           }}>
            <h3 className="text-uppercase fw-bold pt-5 ps-5">User Registration Form</h3>

            <MDBRow className='g-0 '>
              <MDBCol lg={'6'} md='12' sm={'12'} className="d-none d-md-block">
              <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                  <Text> Personal Information </Text>
                  <MDBRow >
                    <MDBCol >
                      <MDBInput wrapperClass='mb-4' label='Full Name' size='lg' id='form1' name='name' type='text' onChange={onChange}/>
                    </MDBCol>
                  </MDBRow>

                  {/* <MDBInput wrapperClass='mb-4' label='Birthday' size='lg' id='form3' type='text'/> */}
                <MDBRow>
                 <FormControl isRequired>
                   <MDBInput wrapperClass='mb-4' label='Date of Birth' size='lg' id='form1' type='date' name="dob" value={dob} onChange={onChange}/>
                 </FormControl>
                </MDBRow>
                <MDBInput wrapperClass='mb-4' name='mobile' label='Phone Number' size='lg' id='form10' type='number' onChange={onChange}/>
                <div className='d-md-flex justify-content-start align-items-center mb-4'>
                  <h6 class=" mb-0 me-4">Gender: </h6>
                  <MDBRadio name='gender' id='inlineRadio1' value='female' label='Female' inline onChange={onChange}/>
                  <MDBRadio name='gender' id='inlineRadio2' value='male' label='Male' inline  onChange={onChange} />
                </div>

                <MDBInput wrapperClass='mb-4' label='Email' placeholder='pillstack@example.com' size='lg' id='form4' type='email' name='email' onChange={onChange}/>
                <MDBInput wrapperClass='mb-4' label='Username' placeholder='Create a Username' name='username' size='lg' id='form5' type='Username' onChange={onChange}/>
                <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form6' name='password' type='password' onChange={onChange}/>

                </MDBCardBody>
                {/* <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp' alt="Sample photo" className="rounded-start" fluid/> */}
              </MDBCol>

              <MDBCol md='6'>
              <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
              <Text> Emergency Contact </Text>

                  <MDBRow >

                  <MDBCol >
                    <MDBInput wrapperClass='mb-4' label='Emergency Contact Name' size='lg' id='form1' type='text' name='EmergencyContact_name' onChange={onChange}/>
                  </MDBCol>

                  </MDBRow>
                  <MDBRow >
                  <Select  className='mb-4' name='EmergencyContact_Relation'  title='Relation To You' placeholder={`${EmergencyContact_name} Relation to you`} onChange={onChange}>
                    <option value='wife'>Wife</option>
                    <option value='husband'>Husband</option>
                    <option value='child'>Child</option>
                  </Select>
                  </MDBRow>
                  <MDBInput wrapperClass='mb-4' name='EmergencyContact_mobileNumber' label='Emergency Phone Number' placeholder={`${EmergencyContact_name}'s phone number`} size='lg' id='form4' type='number' onChange={onChange}/>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
            <MDBRow className='g-0 p-2'>
              <div className="d-flex justify-content-end pt-3">
                <Button
                isDisabled = {!allEntered}
                variant={'solid'} colorScheme="teal" size={'lg'} type="submit"
                onClick={onSubmit}
                >
                  {allEntered? 'Submit' : 'Please fill all fields'}
                </Button>
              </div>
            </MDBRow>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default PatientRegisterForm;