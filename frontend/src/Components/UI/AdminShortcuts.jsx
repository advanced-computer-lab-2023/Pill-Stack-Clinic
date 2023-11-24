import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text} from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Center,AbsoluteCenter , Square, Circle } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon, AddIcon, EmailIcon ,EditIcon,ViewIcon,AttachmentIcon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom'; // Import the Link component
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'


function AdminShortcuts(props) {
  const {openSecondModal,openAddFamilyModal,openViewFamilyModal,openUploadDocModal, navigate, username} = props;
  
  
  return (
    <Card>
<CardHeader h='80px'>
          <Heading size='md'>Shortcuts</Heading>
          </CardHeader>
<Grid
  h='302px'
  w='400px'  
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(2, 1fr)'  
  gap={1}
>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="admin-home/admin-packs"
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay href="admin-home/admin-packs"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">ManagePacks</Box>
    
    <Center>
      <a href="admin-home/admin-packs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>

<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="admin-home/admin-users"
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay href="admin-home/admin-users"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">ManageUsers</Box>
    
    <Center>
      <a href="admin-home/admin-users" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>

<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="admin-home/admin-requests"
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay href="admin-home/admin-requests"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">Doctors' Requests</Box>
    
    <Center>
      <a href="admin-home/admin-requests" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>

<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="admin-home/admin-requests"
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay href="admin-home/admin-requests"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">Pharmacists' Requests</Box>
    
    <Center>
      <a href="admin-home/pharmaRequests" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>






</Grid>
</Card>
  );
}

export default AdminShortcuts;
