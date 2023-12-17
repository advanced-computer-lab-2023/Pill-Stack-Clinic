// Navigation.js
import React from 'react';
import { Box, Button, useColorModeValue } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons'
import '../UI/Styles/Navigation.css';

import { useNavigate } from 'react-router-dom';

const Navigation2 = ({ pagetitle }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        onClick={() => navigate(-1)} // This will take you back to the previous page
        position="fixed"
        top="16px"
        right="16px"
        bg={'#2CAED8'}
        color={'white'}
        borderRadius={'12px'}
        p={'12px'}
        _hover={{
          textDecoration: 'none',
          bg: '#23859B',
        }}
      >
        <ArrowLeftIcon />
      </Button>
    </Box>
  );
};

export default Navigation2;
