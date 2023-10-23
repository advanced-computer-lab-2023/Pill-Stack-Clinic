import React from 'react'
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Text,
} from "@chakra-ui/react";

function UserManagement() {
  return (
    <>
        <Box bg={'#4bbbf3'} p={5} boxShadow='2xl'>
            <Text fontSize={'3xl'} color={'white'} >Manage Users</Text>
        </Box>
    </>
  )
}

export default UserManagement
