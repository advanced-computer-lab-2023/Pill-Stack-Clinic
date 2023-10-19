import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"



function App({x}) {
  // use state for array of applications
  // const [applications, setApplications] = useState([]);
  // useEffect(() => {
  //   Axios.get('http://localhost:8000/admin/applications')
  //   .then((response) => {
  //     console.log("the response " , response.data);
  //     setApplications(response.data);
  //    })
  //    .catch((err) => {
  //      console.log(err);
  //    });
  // }, []);
  const loginIns = ["Username", "Password"];

  return (
    <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} >
      <h1>Welcome TO Pill Stack</h1>
      <MyForm inWidth='200px' />
      <ButtonGroup>
      <Button colorScheme="blue" variant="solid" m={2}>
        Register as a Doctor
      </Button>
      <Button colorScheme="blue" variant="solid" m={2}>
        Register as a Patient
      </Button>
      </ButtonGroup>
    </Flex>
  );
}

export default App;
