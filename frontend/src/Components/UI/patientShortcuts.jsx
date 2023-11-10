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


function PatientShortcuts(props) {
  const {openSecondModal,openAddFamilyModal,openViewFamilyModal,openUploadDocModal, setTab, setInputs } = props;
  
  
  return (
    <Card>
<CardHeader h='80px'>
          <Heading size='md'>Shortcuts</Heading>
          </CardHeader>
<Grid
  h='452px'
  w='400px'
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(2, 1fr)'
  gap={1}
>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openViewFamilyModal}
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay onClick={openViewFamilyModal}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">ViewFam</Box>
    
    <Center>
      <a onClick={openViewFamilyModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>

<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openAddFamilyModal}
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay onClick={openAddFamilyModal}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">AddFam</Box>
    
    <Center>
      <a onClick={openAddFamilyModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AddIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' 
_hover={{ bg: '#353535',  color: 'white' }}>
  <LinkOverlay href='/admin-users'></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">Accept/reject</Box>
    
    <Center>
      <a href="/admin-users" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EmailIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' 
_hover={{ bg: '#353535',  color: 'white' }}>
  <LinkOverlay href='/admin-users'></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">Edit User</Box>
    
    <Center>
      <a href="/admin-users" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openUploadDocModal}
  _hover={{ bg: '#353535',  color: 'white', cursor: "pointer" }}>
  <LinkOverlay onClick={openUploadDocModal}></LinkOverlay>
  <AbsoluteCenter>
    <Box fontSize="16px" mb="10px">Upload/Remove</Box>
    <Center>
      <a onClick={openUploadDocModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AttachmentIcon boxSize={5} />
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox
  as="article"
  w="197px"
  h="148px"
  maxW="sm"
  p="1"
  borderWidth="1px"
  rounded="md"
  _hover={{ bg: "#353535", color: "white", cursor: "pointer" }} // Add cursor: pointer here
  onClick={openSecondModal}
>
  <LinkOverlay onClick={openSecondModal}></LinkOverlay>
  <AbsoluteCenter>
    <Box fontSize="16px" mb="10px">Packages</Box>
    <Center>
      <a
        onClick={openSecondModal}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ViewIcon boxSize={5} />
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>


</Grid>
</Card>
  );
}

export default PatientShortcuts;
