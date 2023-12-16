// Navigation.js
import React from 'react';
import { Box, Flex, Button, useColorModeValue } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons'

import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Flex
        bg={`rgba(255, 255, 255, 0.0)`}
        color={useColorModeValue('gray.600', 'white')}
        minH={'70px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}>
        {/* Replace the following text with your logo or any other content */}
        <Box>
      
        </Box>

        {/* Square button with round edges and black background */}
        <Button
          onClick={() => navigate(-1)} // This will take you back to the previous page
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
};

export default Navigation;
