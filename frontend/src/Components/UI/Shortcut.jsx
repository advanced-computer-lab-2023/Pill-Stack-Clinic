import React from 'react'
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


function Shortcut(
    {
        icon,
        text,
        link
    }
) {
    const navigate = useNavigate();

  return (
    <Box 
    bg={'#ebe9f3'} boxShadow={'xl'} 
    _hover={{ bg: "#8d8f8c", color: "white" }}
    height='100px'  rounded={10}
    as="button" onClick={() => navigate(link)}>
        {icon}
        <Text>{text}</Text>
    </Box>
  )
}

export default Shortcut
