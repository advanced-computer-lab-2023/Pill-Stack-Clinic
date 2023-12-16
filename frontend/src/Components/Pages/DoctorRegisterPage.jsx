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
      const response = await Axios.post('http://localhost:8000/doc_register', payload);
      console.log(response);
      if (response.data.message==='Doctor registered successfully') {
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
    // <Box p={4}>
    //           <Button onClick={back}>back</Button>
    //   <VStack spacing={4} as="form" onSubmit={onSubmit} width="100%" maxWidth="500px" margin="auto">
    //     {/* Form Controls */}
    //     {/* ... other form controls ... */}
    //     <FormControl isRequired>
    //     <FormLabel>Username</FormLabel>
    //     <Input type="text" name="Username" value={formData.Username} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Name</FormLabel>
    //     <Input type="text" name="Name" value={formData.Name} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Email</FormLabel>
    //     <Input type="Email" name="Email" value={formData.Email} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Password</FormLabel>
    //     <Input type="Password" name="Password" value={formData.Password} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Date of Birth</FormLabel>
    //     <Input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Hourly Rate</FormLabel>
    //     <Input type="number" name="HourlyRate" value={formData.HourlyRate} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Affiliation</FormLabel>
    //     <Input type="text" name="Affiliation" value={formData.Affiliation} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Educational Background</FormLabel>
    //     <Input type="text" name="EducationalBackground" value={formData.EducationalBackground} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Speciality</FormLabel>
    //     <Input type="text" name="Speciality" value={formData.Speciality} onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>ID Document</FormLabel>
    //     <Input type="file" name="idDocument" onChange={onChange} />
    //   </FormControl>

    //   <FormControl isRequired>
    //     <FormLabel>Medical License Document</FormLabel>
    //     <Input type="file" name="medicalLicenseDocument" onChange={onChange} />
    //   </FormControl>

      
    //     <FormControl isRequired>
    //       <FormLabel>Medical Degree Document</FormLabel>
    //       <Input type="file" name="medicalDegreeDocument" onChange={onChange} />
    //     </FormControl>

    //     <Button colorScheme="teal" type="submit">Register</Button>
    //   </VStack>
    // </Box>
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
            <h3 className="text-uppercase fw-bold pt-5 ps-5">Doctor Registration Form</h3>

            <MDBRow className='g-0 '>
              <MDBCol lg={'6'} md='12' sm={'12'} className="d-none d-md-block">
              <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                  <Text> Personal Information </Text>
                  <MDBRow >
                    <MDBCol >
                      <MDBInput wrapperClass='mb-4' label='Full Name' size='lg' id='form1' name='Name' type='text' onChange={onChange}/>
                    </MDBCol>
                  </MDBRow>

                  {/* <MDBInput wrapperClass='mb-4' label='Birthday' size='lg' id='form3' type='text'/> */}
                <MDBRow>
                 <FormControl isRequired>
                   <MDBInput wrapperClass='mb-4' label='Date of Birth' size='lg' id='form1' type='date' name="DateOfBirth"  onChange={onChange}/>
                 </FormControl>
                </MDBRow>
                <MDBInput wrapperClass='mb-4' name='mobile' label='Phone Number' size='lg' id='form10' type='number' onChange={onChange}/>
                <div className='d-md-flex justify-content-start align-items-center mb-4'>
                  <h6 class=" mb-0 me-4">Gender: </h6>
                  <MDBRadio name='gender' id='inlineRadio1' value='female' label='Female' inline onChange={onChange}/>
                  <MDBRadio name='gender' id='inlineRadio2' value='male' label='Male' inline  onChange={onChange} />
                </div>

                <MDBInput wrapperClass='mb-4' label='Email' placeholder='pillstack@example.com' size='lg' id='form4' type='email' name='Email' onChange={onChange}/>
                <MDBInput wrapperClass='mb-4' label='Username' placeholder='Create a Username' name='Username' size='lg' id='form5' type='Username' onChange={onChange}/>
                <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form6' name='Password' type='password' onChange={onChange}/>

                </MDBCardBody>
                {/* <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp' alt="Sample photo" className="rounded-start" fluid/> */}
              </MDBCol>

              <MDBCol md='6'>
              <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
              <Text> Career Information </Text>

                  <MDBRow >

                  <MDBCol >
                    <MDBInput wrapperClass='mb-4' label='Affiliation' size='lg' id='form1' type='text' name='Affiliation' onChange={onChange}/>
                  </MDBCol>

                  </MDBRow>
                  
                  <MDBRow >

                  <MDBCol >
                    <MDBInput wrapperClass='mb-4' label='EducationalBackground' size='lg' id='form1' type='text' name='EducationalBackground' onChange={onChange}/>
                  </MDBCol>

                  </MDBRow>
                  <MDBRow >

                    <MDBCol >
                      <MDBInput wrapperClass='mb-4' label=' Speciality' size='lg' id='form1' type='text' name='Speciality' onChange={onChange}/>
                    </MDBCol>

                    </MDBRow>
                    <MDBRow >

                      <MDBCol >
                        <MDBInput wrapperClass='mb-4' label=' HourlyRate' size='lg' id='form1' type='number' name='HourlyRate' onChange={onChange}/>
                      </MDBCol>

                      </MDBRow>
                      <MDBRow>
              <MDBCol>
                <FormControl isRequired>
                  <FormLabel>ID Document</FormLabel>
                  <Input type="file" name="idDocument" onChange={onChange} />
                </FormControl>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <FormControl isRequired>
                  <FormLabel>Medical License Document</FormLabel>
                  <Input type="file" name="medicalLicenseDocument" onChange={onChange} />
                </FormControl>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <FormControl isRequired>
                  <FormLabel>Medical Degree Document</FormLabel>
                  <Input type="file" name="medicalDegreeDocument" onChange={onChange} />
                </FormControl>
              </MDBCol>
            </MDBRow>
                 
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
            <MDBRow className='g-0 p-2'>
              <div className="d-flex justify-content-end pt-3">
              <div className="d-flex justify-content-end pt-3">
                                  
                                  { formData.Username !== '' &&
                      formData.Name !== '' &&
                      formData.Email !== '' &&
                      formData.Password !== '' &&
                      formData.DateOfBirth !== '' &&
                      formData.Affiliation !== '' &&
                      formData.EducationalBackground !== '' &&
                      formData.Speciality !== '' &&  
                      formData.HourlyRate !== '' &&
                    formData.idDocument !== null &&
                    formData.medicalLicenseDocument !== null &&
                    formData.medicalDegreeDocument !== null ? 
                      
                      
                      <Button
                      variant={'solid'} colorScheme="teal" size={'lg'} type="submit"
                      onClick={onSubmit}
                      >Submit</Button> : <Button
                      isDisabled ={ true}
                      variant={'solid'} colorScheme="teal" size={'lg'} type="submit"
                      >Please fill all fields
                                </Button>}
            </div>
              </div>
            </MDBRow>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
  };
  export default DoctorRegisterPage;
