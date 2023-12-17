import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import '../UI/Styles/innerPages.css';
import { Text,Box, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons'
export default function Completion() {
  // Use the useParams hook to access the route parameters
  const { username, packID} = useParams();
  const navigate = useNavigate();
  const back =()=>  navigate("/home");
  useEffect(() => {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    axios.post('http://localhost:8000/stripe/payPack/confirm', {
      username,
      packID
    }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        // Do additional handling here
      })
      .catch(error => {
        console.error(error);
      });
  }, [username,packID]);

  return (
    <Box>
      <Flex
        bg={`rgba(255, 255, 255, 0.0)`}
        color={useColorModeValue('gray.600', 'white')}
        minH={'70px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}>
        <div className='pageTitle'>
          Thank you for purchasing this package.
        </div>
        <Button
          onClick={() => navigate('/home')}
          ml={'auto'}
          bg={'#2CAED8'}
          color={'white'}
          borderRadius={'12px'}
          p={'12px'}
          _hover={{
            textDecoration: 'none',
            bg: '#23859B',
          }}>
          <ArrowLeftIcon/>
        </Button>
      </Flex>
    </Box>
  );
}

